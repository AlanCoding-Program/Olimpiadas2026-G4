const bcrypt = require("bcryptjs");
const pool = require("../config/database");

async function registrarUsuario(req, res) {
    const datos = req.body || {};

    const campos = ["nombre", "apellido", "dni", "email", "contra"];

    if (campos.some((campo) => typeof datos[campo] !== "string")) {
        return res.status(400).json({
            mensaje: "Completá todos los campos."
        });
    }

    const nombre = datos.nombre.trim();
    const apellido = datos.apellido.trim();
    const dni = datos.dni.trim();
    const email = datos.email.trim().toLowerCase();
    const contra = datos.contra;

    if (
        !nombre || nombre.length > 80 ||
        !apellido || apellido.length > 80
    ) {
        return res.status(400).json({
            mensaje: "Nombre y apellido deben tener entre 1 y 80 caracteres."
        });
    }

    if (!/^[0-9]{7,8}$/.test(dni)) {
        return res.status(400).json({
            mensaje: "El DNI debe contener 7 u 8 números, sin puntos."
        });
    }

    if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return res.status(400).json({
            mensaje: "Ingresá un correo electrónico válido."
        });
    }

    if (contra.length < 8 || Buffer.byteLength(contra, "utf8") > 72) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes."
        });
    }

    try {
        const hash = await bcrypt.hash(contra, 12);

        const resultado = await pool.query(
            `INSERT INTO usuarios (
                nombre,
                apellido,
                dni,
                email,
                contra,
                es_admin
            )
            VALUES ($1, $2, $3, $4, $5, FALSE)
            RETURNING id_usuario, nombre, apellido, email`,
            [nombre, apellido, dni, email, hash]
        );

        return res.status(201).json({
            mensaje: "Cuenta creada correctamente. Ya podés iniciar sesión cuando esté habilitado el login.",
            usuario: resultado.rows[0]
        });
    } catch (error) {
        if (
            error.code === "23505" &&
            error.constraint === "usuarios_email_unico"
        ) {
            return res.status(409).json({ mensaje: "Ya existe una cuenta con ese correo electrónico." });
        }

        console.error("Error al registrar usuario:", error.code);

        return res.status(500).json({mensaje: "No se pudo crear la cuenta. Intentá nuevamente."});
    }
}

async function iniciarSesion(req, res) {
    const { email, contra } = req.body || {};

    if (
        typeof email !== "string" ||
        typeof contra !== "string" ||
        !email.trim() ||
        email.trim().length > 254 ||
        !contra ||
        Buffer.byteLength(contra, "utf8") > 72
    ) {
        return res.status(400).json({
            mensaje: "Ingresá un correo y una contraseña válidos."
        });
    }

    try {
        const resultado = await pool.query(
            `SELECT id_usuario, nombre, apellido, email, contra, es_admin
             FROM usuarios
             WHERE LOWER(email) = $1`,
            [email.trim().toLowerCase()]
        );

        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        const coincide = await bcrypt.compare(contra, usuario.contra);

        if (!coincide) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        // Genera una sesión nueva después de verificar la contraseña.
        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => {
                if (error) return reject(error);
                resolve();
            });
        });

        // Guardamos únicamente el identificador del usuario.
        req.session.idUsuario = usuario.id_usuario;

        await new Promise((resolve, reject) => {
            req.session.save((error) => {
                if (error) return reject(error);
                resolve();
            });
        });

        return res.json({
            mensaje: "Sesión iniciada correctamente.",
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                es_admin: usuario.es_admin
            }
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error.code || error.name);

        return res.status(500).json({
            mensaje: "No se pudo iniciar sesión. Intentá nuevamente."
        });
    }
}

async function obtenerSesion(req, res) {
    res.set("Cache-Control", "no-store");

    if (!req.session.idUsuario) {
        return res.status(401).json({
            mensaje: "No hay una sesión iniciada."
        });
    }

    try {
        const resultado = await pool.query(
            `SELECT id_usuario, nombre, apellido, email, es_admin
             FROM usuarios
             WHERE id_usuario = $1`,
            [req.session.idUsuario]
        );

        if (!resultado.rows[0]) {
            return res.status(401).json({
                mensaje: "El usuario ya no está disponible."
            });
        }

        return res.json({
            usuario: resultado.rows[0]
        });
    } catch (error) {
        console.error("Error al consultar sesión:", error.code || error.name);

        return res.status(500).json({
            mensaje: "No se pudo consultar la sesión."
        });
    }
}

function cerrarSesion(req, res) {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({mensaje: "No se pudo cerrar la sesión."});
        }

        res.clearCookie("olimpiadas.sid", { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production"});

        return res.json({mensaje: "Sesión cerrada correctamente."});
    });
}

module.exports = { registrarUsuario, iniciarSesion, obtenerSesion, cerrarSesion};