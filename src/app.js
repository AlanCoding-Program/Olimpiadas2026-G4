const express = require("express");
const pool = require("./config/database");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.json({mensaje: "Backend de Olimpiadas funcionando"});
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            servidor: "ok",
            base_de_datos: "conectada"
        });
    } catch (error) {
        console.error("Falló la consulta de prueba:", error.message);

        res.status(503).json({
            servidor: "ok",
            base_de_datos: "no disponible"
        });
    }
});

module.exports = app;