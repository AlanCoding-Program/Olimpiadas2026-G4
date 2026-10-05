const { randomUUID } = require("node:crypto");
const pool = require("../config/database");

function fallo(mensaje, status = 400) {
    return Object.assign(new Error(mensaje), { status });
}

function texto(valor, nombre, maximo) {
    if (
        typeof valor !== "string" ||
        !valor.trim() ||
        valor.trim().length > maximo
    ) {
        throw fallo(`${nombre}: completá un texto válido.`);
    }

    return valor.trim();
}

function fecha(valor) {
    if (typeof valor !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        throw fallo("Las fechas no son válidas.");
    }

    const resultado = new Date(`${valor}T12:00:00Z`);

    if (
        !Number.isFinite(resultado.getTime()) ||
        resultado.toISOString().slice(0, 10) !== valor
    ) {
        throw fallo("Las fechas no son válidas.");
    }

    return valor;
}

function validar(datos) {
    const destino = texto(datos.destino, "Destino", 150);
    const pais = texto(datos.pais, "País", 100);
    const origen = texto(datos.origen || "Buenos Aires", "Origen", 150);
    const tipo = texto(datos.tipo, "Tipo", 50);

    if (!["Económico", "Intermedio", "All Inclusive"].includes(tipo)) {
        throw fallo("El tipo de paquete no es válido.");
    }

    const fechaEntrada = fecha(datos.fechaEntrada);
    const fechaSalida = fecha(datos.fechaSalida);

    if (fechaSalida <= fechaEntrada) {
        throw fallo("La salida debe ser posterior a la entrada.");
    }

    if (typeof datos.permiteSinAuto !== "boolean") {
        throw fallo("Indicá si el paquete permite reservar sin auto.");
    }

    const opciones = {};
    const codigos = new Set();

    for (const grupo of ["vuelos", "hospedajes", "autos"]) {
        const servicios = datos.opciones?.[grupo];

        if (
            !Array.isArray(servicios) ||
            servicios.length > 10 ||
            (grupo !== "autos" && servicios.length === 0)
        ) {
            throw fallo(`Revisá las opciones de ${grupo}. Máximo: 10.`);
        }

        opciones[grupo] = servicios.map((servicio) => {
            if (!servicio || typeof servicio !== "object") {
                throw fallo("Hay un servicio inválido.");
            }

            const codigo = texto(servicio.codigo, "Código", 50);

            if (!/^[A-Za-z0-9_-]+$/.test(codigo) || codigos.has(codigo)) {
                throw fallo(`Código inválido o repetido: ${codigo}`);
            }

            codigos.add(codigo);

            const precio = servicio.precioUnitario;

            if (
                typeof precio !== "number" ||
                !Number.isFinite(precio) ||
                precio < 0 ||
                precio > 9999999999.99
            ) {
                throw fallo(`Precio inválido: ${codigo}`);
            }

            const capacidad = grupo === "vuelos"
                ? 1
                : servicio.capacidadPersonas;

            if (!Number.isInteger(capacidad) || capacidad < 1) {
                throw fallo(`Capacidad inválida: ${codigo}`);
            }

            return {
                codigo,
                nombre: texto(servicio.nombre, "Nombre del producto", 200),
                precio: precio.toFixed(2),
                capacidad,
                clase: grupo === "vuelos"
                    ? texto(servicio.clase, "Clase del vuelo", 50)
                    : null
            };
        });
    }

    if (!datos.permiteSinAuto && opciones.autos.length === 0) {
        throw fallo("Agregá un auto o permití reservar sin auto.");
    }

    const seleccionInicial = {};

    for (const [campo, grupo] of [
        ["vuelo", "vuelos"],
        ["hospedaje", "hospedajes"],
        ["auto", "autos"]
    ]) {
        const elegida = datos.seleccionInicial?.[campo];

        if (campo === "auto" && elegida === null && datos.permiteSinAuto) {
            seleccionInicial[campo] = null;
            continue;
        }

        seleccionInicial[campo] =
            opciones[grupo].find((opcion) => opcion.codigo === elegida)?.codigo
            || opciones[grupo][0]?.codigo
            || null;
    }

    const noches = Math.round(
        (new Date(`${fechaSalida}T12:00:00Z`) -
         new Date(`${fechaEntrada}T12:00:00Z`)) / 86400000
    );

    return {
        destino,
        pais,
        origen,
        tipo,
        fechaEntrada,
        fechaSalida,
        noches,
        diasEstadia: noches + 1,
        permiteSinAuto: datos.permiteSinAuto,
        seleccionInicial,
        opciones
    };
}

async function guardarPaquete(id, datos) {
    const paquete = validar(datos);
    const nuevo = !id;
    const idPaquete = id || randomUUID();
    const db = await pool.connect();

    try {
        await db.query("BEGIN");

        // Serializar las modificaciones del catálogo administrativo.
        await db.query("SELECT pg_advisory_xact_lock(2026, -1)");

        if (!nuevo) {
            const existente = await db.query(
                `SELECT id_paquete
                 FROM paquetes_config
                 WHERE id_paquete = $1 AND activo = TRUE
                 FOR UPDATE`,
                [idPaquete]
            );

            if (!existente.rowCount) {
                throw fallo("El paquete ya no está disponible.", 404);
            }
        }

        const tablas = {
            vuelos: "detalle_vuelos",
            hospedajes: "detalle_hospedajes",
            autos: "detalle_alquiler_autos"
        };

        for (const [grupo, servicios] of Object.entries(paquete.opciones)) {
            // El nombre de tabla proviene de esta lista fija.
            const tabla = tablas[grupo];

            for (const servicio of servicios) {
                let resultado = await db.query(
                    `SELECT id_producto
                     FROM productos
                     WHERE codigo_producto = $1
                     FOR UPDATE`,
                    [servicio.codigo]
                );

                let idProducto = resultado.rows[0]?.id_producto;

                if (idProducto) {
                    const detalle = await db.query(
                        `SELECT id_producto FROM ${tabla}
                         WHERE id_producto = $1`,
                        [idProducto]
                    );

                    if (!detalle.rowCount) {
                        throw fallo(
                            `El código ${servicio.codigo} pertenece a otro tipo de producto.`
                        );
                    }

                    await db.query(
                        `UPDATE productos
                         SET nombre = $1, precio_unitario = $2
                         WHERE id_producto = $3`,
                        [servicio.nombre, servicio.precio, idProducto]
                    );
                } else {
                    // Reutilizar categoría y sector de un producto del mismo tipo.
                    const referencia = await db.query(
                        `SELECT p.id_categoria, p.id_sector_email
                         FROM productos p
                         JOIN ${tabla} d ON d.id_producto = p.id_producto
                         ORDER BY p.id_producto
                         LIMIT 1`
                    );

                    if (!referencia.rowCount) {
                        throw fallo(`Falta un producto de referencia para ${grupo}.`);
                    }

                    const base = referencia.rows[0];

                    resultado = await db.query(
                        `INSERT INTO productos (
                            id_categoria, id_sector_email, codigo_producto,
                            nombre, precio_unitario, moneda, estado
                         )
                         VALUES ($1, $2, $3, $4, $5, 'ARS', TRUE)
                         RETURNING id_producto`,
                        [
                            base.id_categoria,
                            base.id_sector_email,
                            servicio.codigo,
                            servicio.nombre,
                            servicio.precio
                        ]
                    );

                    idProducto = resultado.rows[0].id_producto;

                    if (grupo === "vuelos") {
                        await db.query(
                            `INSERT INTO detalle_vuelos (
                                id_producto, origen, destino,
                                fecha_salida, fecha_regreso, clase
                             )
                             VALUES ($1, $2, $3, $4, $5, $6)`,
                            [
                                idProducto, paquete.origen, paquete.destino,
                                `${paquete.fechaEntrada}T12:00:00Z`,
                                `${paquete.fechaSalida}T12:00:00Z`,
                                servicio.clase
                            ]
                        );
                    } else if (grupo === "hospedajes") {
                        await db.query(
                            `INSERT INTO detalle_hospedajes (
                                id_producto, ciudad, fecha_entrada,
                                fecha_salida, cantidad_habitaciones,
                                capacidad_personas
                             )
                             VALUES ($1, $2, $3, $4, 1, $5)`,
                            [
                                idProducto, paquete.destino,
                                paquete.fechaEntrada, paquete.fechaSalida,
                                servicio.capacidad
                            ]
                        );
                    } else {
                        await db.query(
                            `INSERT INTO detalle_alquiler_autos (
                                id_producto, lugar_retiro,
                                fecha_hora_retiro, fecha_hora_devolucion,
                                capacidad_personas
                             )
                             VALUES ($1, $2, $3, $4, $5)`,
                            [
                                idProducto, paquete.destino,
                                `${paquete.fechaEntrada}T12:00:00Z`,
                                `${paquete.fechaSalida}T12:00:00Z`,
                                servicio.capacidad
                            ]
                        );
                    }
                }

                // Los detalles compartidos conservan destino y fechas.
                if (grupo === "vuelos") {
                    await db.query(
                        `UPDATE detalle_vuelos SET clase = $1
                         WHERE id_producto = $2`,
                        [servicio.clase, idProducto]
                    );
                } else {
                    await db.query(
                        `UPDATE ${tabla} SET capacidad_personas = $1
                         WHERE id_producto = $2`,
                        [servicio.capacidad, idProducto]
                    );
                }

                const activo = await db.query(
                    `SELECT estado, moneda FROM productos
                     WHERE id_producto = $1`,
                    [idProducto]
                );

                if (!activo.rows[0].estado || activo.rows[0].moneda !== "ARS") {
                    throw fallo(`El producto ${servicio.codigo} no está disponible.`);
                }
            }
        }

        const configuracion = {
            ...paquete,
            id: idPaquete,
            demostracion: true,
            opciones: Object.fromEntries(
                Object.entries(paquete.opciones).map(([grupo, servicios]) => [
                    grupo,
                    servicios.map((servicio) => servicio.codigo)
                ])
            )
        };

        if (nuevo) {
            await db.query(
                `INSERT INTO paquetes_config (id_paquete, configuracion)
                 VALUES ($1, $2::jsonb)`,
                [idPaquete, JSON.stringify(configuracion)]
            );
        } else {
            await db.query(
                `UPDATE paquetes_config
                 SET configuracion = $2::jsonb,
                     fecha_actualizacion = CURRENT_TIMESTAMP
                 WHERE id_paquete = $1`,
                [idPaquete, JSON.stringify(configuracion)]
            );
        }

        await db.query("COMMIT");
        return { id: idPaquete };
    } catch (error) {
        await db.query("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        db.release();
    }
}

async function eliminarPaquete(id) {
    const resultado = await pool.query(
        `UPDATE paquetes_config
         SET activo = FALSE, fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id_paquete = $1 AND activo = TRUE`,
        [id]
    );

    if (!resultado.rowCount) {
        throw fallo("El paquete ya no está disponible.", 404);
    }
}

module.exports = { guardarPaquete, eliminarPaquete };