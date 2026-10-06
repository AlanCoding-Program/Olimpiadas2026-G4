const logoutButton = document.getElementById("logoutButton");
const adminButton = document.getElementById("adminButton");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerHTML");

function actualizarMenu(usuario) {
    const sesionIniciada = Boolean(usuario);

    if (logoutButton) logoutButton.hidden = !sesionIniciada;
    if (loginButton) loginButton.hidden = sesionIniciada;
    if (registerButton) registerButton.hidden = sesionIniciada;

    if (adminButton) {
        adminButton.hidden = usuario?.es_admin !== true;
    }
}

async function comprobarSesion() {
    try {
        const respuesta = await fetch("/api/usuarios/sesion", {
            credentials: "same-origin",
            cache: "no-store"
        });

        if (!respuesta.ok) {
            actualizarMenu(null);
            return;
        }

        const datos = await respuesta.json();
        actualizarMenu(datos.usuario);
    } catch {
        actualizarMenu(null);
    }
}

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        if (logoutButton.disabled) return;

        logoutButton.disabled = true;
        logoutButton.textContent = "Cerrando sesión...";

        try {
            const respuesta = await fetch("/api/usuarios/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({})
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo cerrar la sesión.");
            }

            actualizarMenu(null);
            window.location.replace("/views/login.html");
        } catch {
            alert("No se pudo cerrar la sesión. Intentá nuevamente.");
            logoutButton.disabled = false;
            logoutButton.textContent = "Cerrar sesión";
        }
    });
}

comprobarSesion();