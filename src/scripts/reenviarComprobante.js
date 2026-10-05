const pool = require("../config/database");
const { crearEmailPedido } = require("../services/pedidoEmail");
const { enviarEmail } = require("../services/emailService");

function aCentavos(valor) {
    const [entero, decimal = ""] = String(valor).split(".");

    return Number(entero) * 100 +
        Number(decimal.padEnd(2, "0"));
}

async function main() {
    const numeroPedido = process.argv[2];

    if (!numeroPedido) {
        throw new Error("Indicá el número de pedido.");
    }

    const resultado = await pool.query(
        `SELECT
            p.id_pedido,
            p.numero_pedido,
            p.monto_total,
            u.nombre,
            f.numero_factura,
            f.fecha_emision,
            f.estado_cobro,
            l.id_log,
            l.email_destinatario,
            l.estado_envio

         FROM pedidos AS p

         JOIN usuarios AS u
            ON u.id_usuario = p.id_cliente

         JOIN ventas_facturas AS f
            ON f.id_pedido = p.id_pedido

         JOIN log_notificaciones AS l
            ON l.id_pedido = p.id_pedido

         WHERE p.numero_pedido = $1
           AND l.id_sector_email IS NULL

         ORDER BY l.id_log
         LIMIT 1`,
        [numeroPedido]
    );

    const compra = resultado.rows[0];

    if (!compra) {
        throw new Error(
            "No se encontró el pedido con su comprobante y notificación."
        );
    }

    if (compra.estado_cobro !== "aprobado") {
        throw new Error("El comprobante no tiene un pago aprobado.");
    }

    if (compra.estado_envio === "enviado") {
        console.log("El correo ya figura como enviado. No se reenviará.");
        return;
    }

    const resultadoDetalles = await pool.query(
        `SELECT
            nombre_producto,
            cantidad,
            precio_unitario
         FROM detalle_pedidos
         WHERE id_pedido = $1
         ORDER BY id_detalle`,
        [compra.id_pedido]
    );

    if (resultadoDetalles.rows.length === 0) {
        throw new Error("El pedido no tiene detalles.");
    }

    const mensaje = crearEmailPedido({
        pedido: {
            numero_pedido: compra.numero_pedido
        },
        factura: {
            numero_factura: compra.numero_factura,
            fecha_emision: compra.fecha_emision
        },
        cliente: {
            nombre: compra.nombre,
            email: compra.email_destinatario
        },
        detalles: resultadoDetalles.rows.map((detalle) => ({
            nombre: detalle.nombre_producto,
            cantidad: detalle.cantidad,
            precioCentavos: aCentavos(detalle.precio_unitario)
        })),
        totalCentavos: aCentavos(compra.monto_total)
    });

    try {
        await enviarEmail(mensaje);
    } catch (error) {
        await pool.query(
            `UPDATE log_notificaciones
             SET estado_envio = 'fallido',
                 fecha_envio = NULL
             WHERE id_log = $1`,
            [compra.id_log]
        ).catch((errorLog) => {
            console.error(
                "No se pudo registrar el fallo:",
                errorLog.code || errorLog.name
            );
        });

        throw error;
    }

    console.log("Brevo aceptó el comprobante.");

    try {
        await pool.query(
            `UPDATE log_notificaciones
             SET estado_envio = 'enviado',
                 fecha_envio = CURRENT_TIMESTAMP
             WHERE id_log = $1`,
            [compra.id_log]
        );

        console.log("Registro de notificación actualizado.");
    } catch (error) {
        console.error(
            "Brevo aceptó el correo, pero no se pudo actualizar el log:",
            error.code || error.name
        );

        console.log(
            "No vuelvas a ejecutar el script sin revisar primero los logs de Brevo."
        );

        process.exitCode = 1;
    }
}

main()
    .catch((error) => {
        console.error("Error:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
    