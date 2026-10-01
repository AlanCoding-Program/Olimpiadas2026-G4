const path = require("node:path");
const { Pool } = require("pg");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env")});

if (!process.env.DATABASE_URL) {throw new Error("Falta DATABASE_URL en el archivo .env");}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000
});

pool.on("error", (error) => {console.error("Error de conexión con PostgreSQL:", error.message);});

module.exports = pool;