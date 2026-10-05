const express = require("express");
const { confirmarCompra } = require("../services/comprasService");

const router = express.Router();

router.post("/", async (req, res) => {
    res.set("Cache-Control", "no-store");

    const idCliente = req.session?.idUsuario;

    if (!idCliente) {return res.status(401).json({ mensaje: "Iniciá sesión para confirmar la compra." });
    }

    if (!req.is("application/json")) {
        return res.status(415).json({ mensaje: "La solicitud debe enviarse en formato JSON."});
    }

    const { clave, items, totalEsperadoCentavos} = req.body || {};

    try {
        const resultado = await confirmarCompra({
            idCliente,
            clave,
            items,
            totalEsperadoCentavos
        });

        const mensaje = resultado.repetido ? "Este pedido ya estaba registrado." : "Compra realizada correctamente.";

        return res
            .status(resultado.repetido ? 200 : 201)
            .json({
                mensaje,
                pedido: resultado.pedido,
                factura: resultado.factura,
                correo: resultado.correo,
                repetido: resultado.repetido
            });
    } catch (error) {
        if (Number.isInteger(error.status) && error.status >= 400 && error.status < 500) {
            return res.status(error.status).json({ mensaje: error.message});
        }

        console.error("Error al confirmar la compra:", error.code || error.name);

        return res.status(503).json({
            mensaje:"No se pudo confirmar el resultado de la compra. Reintentá utilizando la misma clave."
        });
    }
});

module.exports = router;
