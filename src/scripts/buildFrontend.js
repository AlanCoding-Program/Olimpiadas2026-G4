const fs = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "../..");
const destino = path.join(raiz, "dist");


fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });

for (const carpeta of ["views", "publics", "admin/assets"]) {
    fs.cpSync(
        path.join(raiz, carpeta),
        path.join(destino, carpeta),
        { recursive: true }
    );
}


fs.writeFileSync(
    path.join(destino, "index.html"),
    `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/views/index.html">
    <title>PyFlight</title>
</head>
<body>
    <a href="/views/index.html">Entrar a PyFlight</a>
</body>
</html>`
);

console.log("Frontend preparado en dist.");