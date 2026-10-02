const express = require("express");
const path = require("node:path");

const pool = require("./config/database");
const usuariosRoutes = require("./routes/usuariosRoutes");
const sessionMiddleware = require("./config/session");

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use("/publics", express.static(path.join(__dirname, "../publics")));

app.use("/admin/assets",express.static(path.join(__dirname, "../admin/assets")));

app.get("/views/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/register.html"));
});

app.use("/api", sessionMiddleware);
app.use("/api/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend de Olimpiadas funcionando"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            servidor: "ok",
            base_de_datos: "conectada"
        });
    } catch (error) {
        console.error("Falló la consulta de prueba:", error.code);

        res.status(503).json({
            servidor: "ok",
            base_de_datos: "no disponible"
        });
    }
});

app.get("/views/login.html", (req, res) => { 
    res.sendFile(path.join(__dirname, "../views/login.html")); 
});

app.get("/views/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

module.exports = app;