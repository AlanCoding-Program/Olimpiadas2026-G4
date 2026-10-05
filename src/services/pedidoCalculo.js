const paquetes = require("../config/paquetes");

function errorPedido(mensaje, status = 400) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function validarCarrito(items) {
    if (!Array.isArray(items) || items.length < 1 || items.length > 20) {
        throw errorPedido("El carrito debe contener entre 1 y 20 selecciones.");
    }

    return items.map((item) => {
        const paquete = paquetes.find( (paquete) => paquete.id === item?.paqueteId);

        if (!paquete) { throw errorPedido("Uno de los paquetes no existe.");}

        if (!Number.isInteger(item.viajeros) || item.viajeros < 1 || item.viajeros > 100) {
            throw errorPedido("La cantidad de viajeros debe ser un entero entre 1 y 100.");
        }

        const seleccion = item.seleccion;

        if (!seleccion || typeof seleccion !== "object") {
            throw errorPedido("Falta seleccionar los productos del paquete.");
        }

        if (!paquete.opciones.vuelos.includes(seleccion.vuelo)) {
            throw errorPedido("El vuelo seleccionado no pertenece al paquete.");
        }

        if (!paquete.opciones.hospedajes.includes(seleccion.hospedaje)) {
            throw errorPedido("El hospedaje seleccionado no pertenece al paquete.");
        }

        if (seleccion.auto === null) {
            if (!paquete.permiteSinAuto) {
                throw errorPedido("Este paquete requiere un vehículo.");
            }
        } else if (!paquete.opciones.autos.includes(seleccion.auto)) {
            throw errorPedido("El vehículo seleccionado no pertenece al paquete.");
        }

        return {
            paqueteId: paquete.id,
            viajeros: item.viajeros,
            seleccion: {
                vuelo: seleccion.vuelo,
                hospedaje: seleccion.hospedaje,
                auto: seleccion.auto
            }
        };
    });
}

function aCentavos(valor) {
    const texto = String(valor);

    if (!/^\d{1,10}(\.\d{1,2})?$/.test(texto)) {
        throw errorPedido("Precio inválido en el catálogo.", 409);
    }

    const [entero, decimal = ""] = texto.split(".");

    return Number(entero) * 100 + Number(decimal.padEnd(2, "0"));
}

function decimal(centavos) {
    const pesos = Math.floor(centavos / 100);
    const resto = String(centavos % 100).padStart(2, "0");

    return `${pesos}.${resto}`;
}

function calcularPedido(items, productos) {
    const productosPorCodigo = new Map(
        productos.map((producto) => [producto.codigo_producto, producto])
    );

    const lineas = new Map();

    for (const item of items) {
        for (const tipo of ["vuelo", "hospedaje", "auto"]) {
            const codigo = item.seleccion[tipo];

            if (tipo === "auto" && codigo === null) { continue; }

            const producto = productosPorCodigo.get(codigo);

            if (!producto || !producto.estado || producto.moneda !== "ARS" || !producto[`id_${tipo}`]) {
                throw errorPedido("Un producto ya no está disponible. Recargá el catálogo.", 409);
            }

            const capacidad = tipo === "vuelo" ? 1 : producto[`capacidad_${tipo}`];

            if (!Number.isInteger(capacidad) || capacidad < 1) {
                throw errorPedido("La capacidad de un producto no es válida.", 409);
            }

            const cantidad = Math.ceil(item.viajeros / capacidad);

            const lineaExistente = lineas.get(producto.id_producto);

            if (lineaExistente) {
                lineaExistente.cantidad += cantidad;
            } else {
                lineas.set(producto.id_producto, {
                    idProducto: producto.id_producto,
                    nombre: producto.nombre,
                    cantidad,
                    precioCentavos: aCentavos(producto.precio_unitario)
                });
            }
        }
    }

    const detalles = [...lineas.values()];

    const totalCentavos = detalles.reduce(
        (total, detalle) => total + detalle.cantidad * detalle.precioCentavos, 0
    );

    if (
        !Number.isSafeInteger(totalCentavos) || totalCentavos > 99999999999999
    ) {
        throw errorPedido( "El total del pedido supera el máximo permitido." );
    }

    return {
        detalles,
        totalCentavos
    };
}

module.exports = {
    validarCarrito,
    calcularPedido,
    errorPedido,
    decimal
};