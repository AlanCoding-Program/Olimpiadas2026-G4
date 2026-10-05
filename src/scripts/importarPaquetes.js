const pool = require("../config/database");
const paquetes = require("../config/paquetes");

async function main() {
    const db = await pool.connect();

    try {
        await db.query("BEGIN");

        let insertados = 0;

        for (const paquete of paquetes) {
            const resultado = await db.query(
                `INSERT INTO paquetes_config (
                    id_paquete,
                    configuracion
                 )
                 VALUES ($1, $2::jsonb)
                 ON CONFLICT (id_paquete) DO NOTHING`,
                [paquete.id, JSON.stringify(paquete)]
            );

            insertados += resultado.rowCount;
        }

        await db.query("COMMIT");

        console.log(`Paquetes importados: ${insertados}`);
    } catch (error) {
        await db.query("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        db.release();
    }
}

main()
    .catch((error) => {
        console.error("Falló la importación:", error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());