const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (registerButton.disabled) return;
    if (!registerForm.reportValidity()) return;

    const usuario = {
        nombre: document.getElementById("username").value.trim(),
        apellido: document.getElementById("surname").value.trim(),
        dni: document.getElementById("dni").value.trim(),
        email: document.getElementById("email").value.trim(),
        contra: document.getElementById("password").value
    };

    registerButton.disabled = true;
    registerButton.textContent = "Creando cuenta...";

    try {
        const respuesta = await fetch("/api/usuarios/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(usuario)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "No se pudo crear la cuenta.");
            return;
        }

        registerForm.reset();
        alert("Cuenta creada correctamente.");
    } catch (error) {
        alert("No se pudo confirmar el registro. Revisá la conexión antes de volver a intentarlo.");
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Enviar";
    }
});