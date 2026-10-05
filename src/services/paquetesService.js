const pool = require("../config/database");

async function listarPaquetes(db = pool) {
    const resultado = await db.query(
        `SELECT id_paquete, configuracion
         FROM paquetes_config
         WHERE activo = TRUE
         ORDER BY id_paquete`
    );

    return resultado.rows.map((fila) => ({
        ...fila.configuracion,
        id: fila.id_paquete
    }));
}

module.exports = { listarPaquetes };