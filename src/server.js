const app = require("./app");
const pool = require("./config/database");

const PORT = Number(process.env.PORT || 3000);

async function iniciarServidor() {
    try {
        const resultado = await pool.query("SELECT current_database() AS base");

        console.log(`Conectado a PostgreSQL: ${resultado.rows[0].base}`);

        const servidor = app.listen(PORT, () => {console.log(`Servidor disponible en http://localhost:${PORT}`);});

        servidor.on("error", async (error) => {
            console.error("No se pudo iniciar Express:", error.message);
            await pool.end();
            process.exitCode = 1;
        });
    } catch (error) {
        console.error("No se pudo conectar con Neon:", error.message);
        await pool.end();
        process.exitCode = 1;
    }
}

iniciarServidor();