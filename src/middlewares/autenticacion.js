const pool = require("../config/database");

async function requerirAdmin(req, res, next) {
    res.set("Cache-Control", "no-store");

    const idUsuario = req.session?.idUsuario;

    if (!idUsuario) {
        return res.status(401).json({mensaje: "Iniciá sesión para continuar."});
    }

    try {
        const resultado = await pool.query(
            `SELECT es_admin
             FROM usuarios
             WHERE id_usuario = $1`,
            [idUsuario]
        );

        if (resultado.rows[0]?.es_admin !== true) {
            return res.status(403).json({mensaje: "No tenés permisos de administrador."});
        }

        next();
    } catch (error) {
        console.error("Error al verificar permisos:",error.code || error.name);

        return res.status(503).json({mensaje: "No se pudieron verificar los permisos."});
    }
}

module.exports = { requerirAdmin };