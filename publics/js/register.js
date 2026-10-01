const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = {
        nombre: document.getElementById("username").value,
        apellido: document.getElementById("surname").value,
        dni: document.getElementById("dni").value,
        email: document.getElementById("email").value,
        contra: document.getElementById("password").value
    };
});