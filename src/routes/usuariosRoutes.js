const express = require("express");

const {registrarUsuario, iniciarSesion, obtenerSesion, cerrarSesion} = require("../controllers/usuariosController");

const router = express.Router();

// Las operaciones POST de esta API reciben JSON.
router.use((req, res, next) => {
    if (req.method === "POST" && !req.is("application/json")) {
        return res.status(415).json({ mensaje: "El cuerpo de la solicitud debe ser JSON." });
    }
    next();
});

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);
router.get("/sesion", obtenerSesion);
router.post("/logout", cerrarSesion);

module.exports = router;