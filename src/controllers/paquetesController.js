const pool = require("../config/database");
const paquetes = require("../config/paquetes");

async function obtenerPaquetes(req, res) {
    res.set("Cache-Control", "no-store");

    try {
        const codigos = [...new Set(paquetes.flatMap((paquete) => [
            ...paquete.opciones.vuelos,
            ...paquete.opciones.hospedajes,
            ...paquete.opciones.autos
        ])
    )
];

const resultado = await pool.query(
            `SELECT
                p.id_producto,
                p.codigo_producto,
                p.nombre,
                p.precio_unitario,
                p.moneda,

                v.id_vuelo,
                v.clase,
                v.origen,
                v.destino,
                v.fecha_salida AS salida_vuelo,
                v.fecha_regreso,

                h.id_hospedaje,
                h.ciudad,
                h.fecha_entrada::text AS entrada_hospedaje,
                h.fecha_salida::text AS salida_hospedaje,
                h.cantidad_habitaciones,
                h.capacidad_personas AS capacidad_hospedaje,

                a.id_alquiler_auto,
                a.lugar_retiro,
                a.fecha_hora_retiro,
                a.fecha_hora_devolucion,
                a.capacidad_personas AS capacidad_auto

             FROM productos AS p
             LEFT JOIN detalle_vuelos AS v
                ON v.id_producto = p.id_producto
             LEFT JOIN detalle_hospedajes AS h
                ON h.id_producto = p.id_producto
             LEFT JOIN detalle_alquiler_autos AS a
                ON a.id_producto = p.id_producto

             WHERE p.codigo_producto = ANY($1::text[])
               AND p.estado = TRUE`,
            [codigos]
        );
        
const productosPorCodigo = new Map( resultado.rows.map((producto) => [
                producto.codigo_producto, producto
            ])
        );

function obtenerOpcion(codigo, tipo) {
    const producto = productosPorCodigo.get(codigo);
    
    if (!producto) {
        throw new Error(`Producto ausente o inactivo: ${codigo}`);
            }
    const precio = Number(producto.precio_unitario);
    
    if (producto.moneda !== "ARS" || !Number.isFinite(precio) || precio < 0) {
        throw new Error(`Precio o moneda inválidos: ${codigo}`);
        }
        
    const opcion = {
                idProducto: producto.id_producto,
                codigo: producto.codigo_producto,
                nombre: producto.nombre,
                precioUnitario: precio,
                moneda: producto.moneda
            };

    if (tipo === "vuelo") {
        if (!producto.id_vuelo) {
            throw new Error(`Falta detalle de vuelo: ${codigo}`);
        }
        
    return {
        ...opcion,
        clase: producto.clase,
        origen: producto.origen,
        destino: producto.destino,
        fechaSalida: producto.salida_vuelo,
        fechaRegreso: producto.fecha_regreso
      };
    }
    
    const esHospedaje = tipo === "hospedaje";
    const idDetalle = esHospedaje ? producto.id_hospedaje : producto.id_alquiler_auto;
    const capacidad = esHospedaje ? producto.capacidad_hospedaje : producto.capacidad_auto;
    if (!idDetalle || !Number.isInteger(capacidad) || capacidad <= 0) {
        throw new Error(`Detalle o capacidad inválidos: ${codigo}`);
    }
    if (esHospedaje) {
        return {
            ...opcion,
            capacidadPersonas: capacidad,
            cantidadHabitaciones: producto.cantidad_habitaciones,
            ciudad: producto.ciudad,
            fechaEntrada: producto.entrada_hospedaje,
            fechaSalida: producto.salida_hospedaje
        };
    }
    return {
        ...opcion,
        capacidadPersonas: capacidad,
        lugarRetiro: producto.lugar_retiro,
        fechaRetiro: producto.fecha_hora_retiro,
        fechaDevolucion: producto.fecha_hora_devolucion
    };
}

const catalogo = paquetes.map((paquete) => {
    const opciones = { vuelos: paquete.opciones.vuelos.map(
        (codigo) => obtenerOpcion(codigo, "vuelo")
    ),
    hospedajes: paquete.opciones.hospedajes.map(
        (codigo) => obtenerOpcion(codigo, "hospedaje")
    ),
    autos: paquete.opciones.autos.map(
        (codigo) => obtenerOpcion(codigo, "auto")
    )};

    const inicial = paquete.seleccionInicial;
    const vuelo = opciones.vuelos.find((opcion) => opcion.codigo === inicial.vuelo);
    const hospedaje = opciones.hospedajes.find((opcion) => opcion.codigo === inicial.hospedaje);
    const auto = inicial.auto === null ? null : opciones.autos.find( (opcion) => opcion.codigo === inicial.auto);
    
    if (!vuelo || !hospedaje || (inicial.auto !== null && !auto)) {
        throw new Error(`Selección inicial inválida: ${paquete.id}`);
            }
            
    const precioInicialCentavos =
       Math.round(vuelo.precioUnitario * 100) +
       Math.round(hospedaje.precioUnitario * 100) +
       Math.round((auto?.precioUnitario ?? 0) * 100);

    return {
        ...paquete,
        moneda: "ARS",
        viajerosIniciales: 1,
        precioInicial: precioInicialCentavos / 100,
        opciones
    };
});

return res.json({ paquetes: catalogo });
    } catch (error) {
        console.error("Error al obtener paquetes:", error.message);

        return res.status(503).json({ mensaje: "No se pudo cargar el catálogo. Intentá nuevamente."});
    }
}

module.exports = { obtenerPaquetes };