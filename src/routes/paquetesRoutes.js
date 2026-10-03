const express = require("express");
const { obtenerPaquetes} = require("../controllers/paquetesController");

const router = express.Router();

router.get("/", obtenerPaquetes);

module.exports = router;