const logoutButton = document.getElementById("logoutButton");
const adminButton = document.getElementById("adminButton");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerHTML");

if (logoutButton) {
    comprobarSesion();

    logoutButton.addEventListener("click", async () => {
        if (logoutButton.disabled) return;
        logoutButton.disabled = true;
        logoutButton.textContent = "Cerrando sesión...";

        try {
            const respuesta = await fetch("/api/usuarios/logout", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "same-origin",
                body: JSON.stringify({})
            });

            if (!respuesta.ok) {throw new Error("No se pudo cerrar la sesión.");}

            window.location.replace("/views/login.html");

        } catch (error) {
            alert("No se pudo cerrar la sesión. Intentá nuevamente.");

            logoutButton.disabled = false;
            logoutButton.textContent = "Cerrar sesión";
        }
    });
}

async function comprobarSesion() {
    if (adminButton) adminButton.hidden = true;

    try {
        const respuesta = await fetch("/api/usuarios/sesion", {
            credentials: "same-origin",
            cache: "no-store"
        });

        logoutButton.hidden = !respuesta.ok;

        if (!respuesta.ok) return;

        const datos = await respuesta.json();

        if (adminButton) {
            adminButton.hidden = datos.usuario?.es_admin !== true;
        }
    } catch (error) {
        logoutButton.hidden = true;
        if (adminButton) adminButton.hidden = true;
    }
}