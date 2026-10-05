const express = require("express");
const { requerirAdmin } = require("../middlewares/autenticacion");
const { obtenerPaquetes } = require("../controllers/paquetesController");
const {
    guardarPaquete,
    eliminarPaquete
} = require("../services/adminPaquetesService");

const router = express.Router();

router.use(requerirAdmin);

router.get("/sesion", (req, res) => {
    res.json({ administrador: true });
});

router.get("/paquetes", obtenerPaquetes);

router.use((req, res, next) => {
    if (
        ["POST", "PUT"].includes(req.method) &&
        !req.is("application/json")
    ) {
        return res.status(415).json({
            mensaje: "La solicitud debe contener JSON."
        });
    }

    next();
});

function responderError(res, error) {
    if (error.status) {
        return res.status(error.status).json({ mensaje: error.message });
    }

    console.error("Error administrativo:", error.code || error.name);

    return res.status(500).json({
        mensaje: "No se pudo guardar el cambio. Revisá los logs del backend."
    });
}

router.post("/paquetes", async (req, res) => {
    try {
        const paquete = await guardarPaquete(null, req.body || {});
        res.status(201).json({ mensaje: "Paquete creado.", paquete });
    } catch (error) {
        responderError(res, error);
    }
});

router.put("/paquetes/:id", async (req, res) => {
    try {
        const paquete = await guardarPaquete(req.params.id, req.body || {});
        res.json({ mensaje: "Paquete actualizado.", paquete });
    } catch (error) {
        responderError(res, error);
    }
});

router.delete("/paquetes/:id", async (req, res) => {
    try {
        await eliminarPaquete(req.params.id);
        res.json({ mensaje: "Paquete dado de baja." });
    } catch (error) {
        responderError(res, error);
    }
});

module.exports = router;