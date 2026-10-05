function escaparHtml(valor) {
    const equivalencias = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(valor).replace(/[&<>"']/g, (caracter) => equivalencias[caracter]);
}

function formatearPrecio(centavos) {
    return new Intl.NumberFormat("es-AR", {style: "currency", currency: "ARS"}).format(centavos / 100);
}

function crearEmailPedido({
    pedido,
    factura,
    cliente,
    detalles,
    totalCentavos
}) {
    if (!factura) {
        throw new Error("Falta el comprobante de la compra.");
    }

    const fechaEmision = new Intl.DateTimeFormat("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Argentina/Buenos_Aires"
    }).format(new Date(factura.fecha_emision));

    const filas = detalles.map((detalle) => {
        const subtotal = detalle.cantidad * detalle.precioCentavos;

        return `<tr>
                  <td>${escaparHtml(detalle.nombre)}</td>
                  <td>${detalle.cantidad}</td>
                  <td>${formatearPrecio(detalle.precioCentavos)}</td>
                  <td>${formatearPrecio(subtotal)}</td>
               </tr>`;
    }).join("");

    return {
        destinatario: cliente.email,

        asunto: `PyFlight - Comprobante ${factura.numero_factura}`,

        html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Comprobante de compra</title>
            </head>

            <body style="font-family: Arial, sans-serif; color: #222;">
                <h1>¡Compra realizada correctamente!</h1>

                <p>Hola, ${escaparHtml(cliente.nombre)}.</p>

                <p>
                    Gracias por elegir PyFlight.
                    A continuación encontrarás el detalle de tu compra.
                </p>

                <h2>Comprobante de compra</h2>

                <p>
                    <strong>Número de comprobante:</strong>
                    ${escaparHtml(factura.numero_factura)}
                </p>

                <p>
                    <strong>Número de pedido:</strong>
                    ${escaparHtml(pedido.numero_pedido)}
                </p>

                <p>
                    <strong>Fecha de emisión:</strong>
                    ${escaparHtml(fechaEmision)}
                </p>

                <p>
                    <strong>Estado del pago:</strong>
                    Aprobado
                </p>

                <table
                    cellpadding="8"
                    border="1"
                    style="border-collapse: collapse; width: 100%;"
                >
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filas}
                    </tbody>
                </table>

                <p style="font-size: 18px;">
                    <strong>
                        Total: ${formatearPrecio(totalCentavos)} ARS
                    </strong>
                </p>

                <p>Equipo de PyFlight</p>

                <hr>

                <p style="font-size: 12px; color: #666;">
                    Proyecto de Olimpiadas: pago simulado.
                </p>
            </body>
            </html>
        `
    };
}

module.exports = {
    crearEmailPedido
};