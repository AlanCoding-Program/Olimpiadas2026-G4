async function enviarEmail({ destinatario, asunto, html }) {
    const apiKey = process.env.BREVO_API_KEY;
    const emailRemitente = process.env.BREVO_SENDER_EMAIL;
    const nombreRemitente = process.env.BREVO_SENDER_NAME || "PyFlight";

    if (!apiKey || !emailRemitente) { throw new Error("Falta configurar el correo en el archivo .env."); }

    if (!destinatario || !asunto || !html) { throw new Error("Faltan datos del correo."); }

    const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": apiKey
        },
        body: JSON.stringify({
            sender: {
                name: nombreRemitente,
                email: emailRemitente
            },
            to: [{ email: destinatario }],
            subject: asunto,
            htmlContent: html
        }),
        signal: AbortSignal.timeout(15000)
    });

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        throw new Error(`Brevo (${respuesta.status}): ${datos.message || "No se pudo enviar el correo."}`);
    }

    return datos;
}

module.exports = { enviarEmail };