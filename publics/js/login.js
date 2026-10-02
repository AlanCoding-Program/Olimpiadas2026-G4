const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMensaje = document.getElementById("loginMensaje");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (loginButton.disabled) return;
    if (!loginForm.reportValidity()) return;

    loginMensaje.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Ingresando...";

    try {
        const respuesta = await fetch("/api/usuarios/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "same-origin",
            body: JSON.stringify({
                email: document.getElementById("email").value.trim(),
                contra: document.getElementById("password").value
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            loginMensaje.textContent = resultado.mensaje || "No se pudo iniciar sesión.";
            return;
        }

        window.location.href = "/views/index.html";

    } catch (error) {
        loginMensaje.textContent ="No se pudo conectar con el servidor. Intentá nuevamente.";
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Iniciar sesión";
    }
});