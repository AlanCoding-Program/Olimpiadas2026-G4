const { createHash } = require("node:crypto");
const pool = require("../config/database");
const { listarPaquetes } = require("./paquetesService");

const {
    validarCarrito,
    calcularPedido,
    errorPedido,
    decimal
} = require("./pedidoCalculo");

async function prepararPedido(db, items, totalEsperadoCentavos) {
    const paquetes = await listarPaquetes(db);
    const carritoValidado = validarCarrito(items, paquetes);

    if (!Number.isSafeInteger(totalEsperadoCentavos) || totalEsperadoCentavos < 0) {
        throw errorPedido("El total esperado no es válido.");
    }

    const codigos = [...new Set(carritoValidado.flatMap((item) => [
                    item.seleccion.vuelo,
                    item.seleccion.hospedaje,
                    item.seleccion.auto
                ])
                .filter((codigo) => codigo !== null)
            )
        ];

    const resultado = await db.query(
        `SELECT
            p.id_producto,
            p.codigo_producto,
            p.nombre,
            p.precio_unitario,
            p.moneda,
            p.estado,

            v.id_vuelo,

            h.id_hospedaje,
            h.capacidad_personas AS capacidad_hospedaje,

            a.id_alquiler_auto AS id_auto,
            a.capacidad_personas AS capacidad_auto

         FROM productos AS p

         LEFT JOIN detalle_vuelos AS v
            ON v.id_producto = p.id_producto

         LEFT JOIN detalle_hospedajes AS h
            ON h.id_producto = p.id_producto

         LEFT JOIN detalle_alquiler_autos AS a
            ON a.id_producto = p.id_producto

         WHERE p.codigo_producto = ANY($1::text[])`,
        [codigos]
    );

    const calculo = calcularPedido(carritoValidado, resultado.rows);

    if (calculo.totalCentavos !== totalEsperadoCentavos) {
        throw errorPedido("El precio o la capacidad cambió. Recargá la página y revisá el total antes de confirmar.", 409);
    }

    return calculo;
}

async function crearPedido({
    idCliente,
    clave,
    items,
    totalEsperadoCentavos
}) {
    if (!Number.isInteger(idCliente) || idCliente < 1) {
        throw errorPedido("Iniciá sesión para confirmar el pedido.", 401);
    }

    const formatoUUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

    if (typeof clave !== "string" || !formatoUUID.test(clave)) {
        throw errorPedido("El identificador de la solicitud no es válido.");
    }

    const numeroPedido = "PED-" + createHash("sha256")
        .update(`${idCliente}:${clave}`)
        .digest("hex")
        .slice(0, 40);

    const db = await pool.connect();

    try {
        await db.query("BEGIN");

        await db.query("SELECT pg_advisory_xact_lock($1, $2)", [2026, idCliente]);

        const existente = await db.query(
            `SELECT
                p.id_pedido,
                p.numero_pedido,
                p.monto_total,
                e.nombre_estado

             FROM pedidos AS p
             JOIN estados_pedidos AS e
                ON e.id_estado_pedido = p.id_estado_pedido

             WHERE p.numero_pedido = $1
               AND p.id_cliente = $2`,
            [numeroPedido, idCliente]
        );

        if (existente.rows.length > 0) {
            const resultadoFactura = await db.query(
                `SELECT
                  id_venta,
                  numero_factura,
                  fecha_emision,
                  monto_total,
                  metodo_pago,
                  estado_cobro
                  FROM ventas_facturas
                  WHERE id_pedido = $1`,
                  [existente.rows[0].id_pedido]
                );
        
        await db.query("COMMIT");
        
        return {
            pedido: existente.rows[0],
            factura: resultadoFactura.rows[0] || null,
            repetido: true
        };
    }

        const resultadoCliente = await db.query(
            `SELECT nombre, email
              FROM usuarios
              WHERE id_usuario = $1`,
              [idCliente]
            );
            
        const cliente = resultadoCliente.rows[0];
        
        if (!cliente) {
            throw errorPedido("El usuario ya no está disponible. Iniciá sesión nuevamente.", 401);
        }

        const calculo = await prepararPedido(
            db,
            items,
            totalEsperadoCentavos
        );

        const estado = await db.query(
            `SELECT id_estado_pedido
             FROM estados_pedidos
             WHERE nombre_estado = $1`,
            ["pagado"]
        );

        if (estado.rows.length === 0) {
            throw new Error("No existe el estado pagado en la base de datos.");
        }

        const resultado = await db.query(
            `INSERT INTO pedidos (
                numero_pedido,
                id_cliente,
                id_estado_pedido,
                monto_total
             )
             VALUES ($1, $2, $3, $4)

             RETURNING
                id_pedido,
                numero_pedido,
                monto_total`,
            [
                numeroPedido,
                idCliente,
                estado.rows[0].id_estado_pedido,
                decimal(calculo.totalCentavos)
            ]
        );

        const pedido = resultado.rows[0];

        for (const detalle of calculo.detalles) {
            await db.query(
                `INSERT INTO detalle_pedidos (
                    id_pedido,
                    id_producto,
                    nombre_producto,
                    cantidad,
                    precio_unitario
                 )
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    pedido.id_pedido,
                    detalle.idProducto,
                    detalle.nombre,
                    detalle.cantidad,
                    decimal(detalle.precioCentavos)
                ]
            );
        }

        const numeroFactura = numeroPedido.replace(/^PED-/, "DEMO-");
        
        const resultadoFactura = await db.query(
            `INSERT INTO ventas_facturas (
                id_pedido,
                id_cliente,
                numero_factura,
                monto_total,
                metodo_pago,
                estado_cobro
                )
            VALUES ($1, $2, $3, $4, $5, $6)
            
            RETURNING
              id_venta,
              numero_factura,
              fecha_emision,
              monto_total,
              metodo_pago,
              estado_cobro`,
              [pedido.id_pedido,
               idCliente,
               numeroFactura,
               decimal(calculo.totalCentavos),
               "simulado",
               "aprobado"]
            );
        const factura = resultadoFactura.rows[0];

        const resultadoNotificacion = await db.query(
            `INSERT INTO log_notificaciones (
               id_pedido,
               email_destinatario,
               estado_envio
             )
             VALUES ($1, $2, $3)
             RETURNING id_log`,
             [pedido.id_pedido,
              cliente.email,
              "pendiente"]
            );
        
        const notificacion = resultadoNotificacion.rows[0];

        await db.query("COMMIT");

        return {
            pedido: {
                ...pedido,
                nombre_estado: "pagado"
            },
            factura,
            repetido: false,
            cliente,
            detalles: calculo.detalles,
            totalCentavos: calculo.totalCentavos,
            idLog: notificacion.id_log
        };
    } catch (error) {
        await db.query("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        db.release();
    }
}

module.exports = {
    prepararPedido,
    crearPedido
};