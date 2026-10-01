const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const icon = togglePassword.querySelector("iconify-icon");

togglePassword.addEventListener("click", () => {
    const mostrar = password.type === "password";
    password.type = mostrar ? "text" : "password";
    togglePassword.setAttribute(
        "aria-label",
        mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
    );

    icon.setAttribute(
        "icon",
        mostrar ? "akar-icons:eye-slashed" : "akar-icons:eye"
    );
});