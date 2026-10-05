const express = require("express");
const { requerirAdmin } = require("../middlewares/autenticacion");

const router = express.Router();

router.use(requerirAdmin);

router.get("/sesion", (req, res) => {
    res.json({ administrador: true });
});

module.exports = router;