const path = require("node:path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { enviarEmail } = require("../services/emailService");

async function main() {
    const destinatario = process.argv[2];

    if (!destinatario) {throw new Error("Indicá el destinatario: node src/scripts/probarEmail.js tu-correo"); }

    const resultado = await enviarEmail({
        destinatario,
        asunto: "PyFlight - Prueba de envío",
        html: `<h1>¡Hola desde PyFlight!</h1>
               <p>Este es un correo de prueba enviado desde nuestro backend.</p>
               <p>No corresponde a una compra real.</p>`
    });

    console.log("Brevo aceptó el correo.");
    console.log("ID del mensaje:", resultado.messageId);
    console.log("Revisá la bandeja de entrada y la carpeta de spam.");
}

main().catch((error) => {
    console.error("Error:", error.message);
    process.exitCode = 1;
});