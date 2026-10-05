const pool = require("../config/database");
const { crearPedido } = require("./pedidosService");
const { crearEmailPedido } = require("./pedidoEmail");
const { enviarEmail } = require("./emailService");

async function confirmarCompra(datos) {
    
    const resultado = await crearPedido(datos);

    let estadoCorreo = "pendiente";

    if (resultado.repetido) {
      
        try {
            const notificacion = await pool.query(
                `SELECT estado_envio
                 FROM log_notificaciones
                 WHERE id_pedido = $1
                   AND id_sector_email IS NULL
                 ORDER BY id_log
                 LIMIT 1`,
                [resultado.pedido.id_pedido]
            );

            estadoCorreo = notificacion.rows[0]?.estado_envio || "pendiente";
        } catch (error) {
            console.error(
                "No se pudo consultar el estado del correo:",
                error.code || error.name
            );
        }
    } else {
        try {
            const mensaje = crearEmailPedido(resultado);

            await enviarEmail(mensaje);

            estadoCorreo = "enviado";
        } catch (error) {
            estadoCorreo = "fallido";

            console.error("Falló el correo del pedido:", resultado.pedido.numero_pedido, error.message);
        }

        try {
            await pool.query(
                `UPDATE log_notificaciones SET estado_envio = $1: :varchar(20),
                  fecha_envio = CASE WHEN $1::varchar(20) = 'enviado' THEN CURRENT_TIMESTAMP ELSE NULL
                  END WHERE id_log = $2::integer`,
                [estadoCorreo, resultado.idLog]
            );
        } catch (error) {
            console.error(
                "No se pudo actualizar el registro del correo:",
                resultado.idLog,
                error.code || error.name
            );

            estadoCorreo = "pendiente";
        }
    }

    return {
        pedido: resultado.pedido,
        factura: resultado.factura,
        correo: estadoCorreo,
        repetido: resultado.repetido
    };
}

module.exports = {confirmarCompra};