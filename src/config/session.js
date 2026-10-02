const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const pool = require("./database");

if (!process.env.SESSION_SECRET) { throw new Error("Falta SESSION_SECRET en el archivo .env"); }

module.exports = session({ store: new PgSession({
        pool,
        tableName: "sesiones",
        createTableIfMissing: true
    }),

    name: "olimpiadas.sid",
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 8
    }
});