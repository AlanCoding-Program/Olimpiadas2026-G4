const porId = (id) => document.getElementById(id);

const form = porId("formPaquete");
const lista = porId("listaPaquetes");
const buscador = porId("buscarPaquete");
const mensaje = porId("mensaje");
const modal = porId("modalEliminar");

const grupos = {
    vuelos: porId("vuelosContainer"),
    hospedajes: porId("hospedajesContainer"),
    autos: porId("autosContainer")
};

let paquetes = [];
let editando = null;
let eliminando = null;
let ocupado = false;
let autorizado = false;
let temporizador;

function avisar(texto) {
    clearTimeout(temporizador);
    mensaje.textContent = texto;
    mensaje.classList.add("mostrar");

    temporizador = setTimeout(() => {
        mensaje.classList.remove("mostrar");
    }, 8000);
}

function bloquear(valor) {
    ocupado = valor;

    document.querySelectorAll("button, input, select").forEach((control) => {
        control.disabled = valor || !autorizado;
    });
}

async function api(ruta, opciones = {}) {
    const respuesta = await fetch(`/api/admin${ruta}`, {
        ...opciones,
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            ...opciones.headers
        }
    });

    const datos = await respuesta.json().catch(() => ({}));

    if (respuesta.status === 401) {
        window.location.href = "login.html";
        throw new Error("Iniciá sesión.");
    }

    if (respuesta.status === 403) {
        autorizado = false;
        throw new Error("Tu cuenta no tiene permisos de administrador.");
    }

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo completar la operación.");
    }

    return datos;
}

function elemento(etiqueta, texto, clase) {
    const nodo = document.createElement(etiqueta);
    if (texto !== undefined) nodo.textContent = texto;
    if (clase) nodo.className = clase;
    return nodo;
}

function precio(valor) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    }).format(valor);
}

function agregarServicio(grupo, datos = {}) {
    const fila = elemento("div", undefined, "servicio");
    fila.dataset.grupo = grupo;

    function campo(titulo, nombre, valor, tipo = "text") {
        const contenedor = elemento("label", undefined, "campo");
        contenedor.append(elemento("span", titulo));

        const input = document.createElement("input");
        input.className = `servicio-${nombre}`;
        input.type = tipo;
        input.value = valor ?? "";
        input.required = true;

        if (tipo === "number") {
            input.min = nombre === "capacidad" ? "1" : "0";
            input.step = nombre === "capacidad" ? "1" : "0.01";
        }

        contenedor.append(input);
        fila.append(contenedor);
    }

    campo("Código", "codigo", datos.codigo);
    campo("Nombre", "nombre", datos.nombre);
    campo("Precio ARS", "precio", datos.precioUnitario, "number");

    if (grupo === "vuelos") {
        campo("Clase", "clase", datos.clase);
    } else {
        campo("Capacidad", "capacidad", datos.capacidadPersonas, "number");
    }

    const quitar = elemento("button", "Quitar opción", "btn-remover");
    quitar.type = "button";

    quitar.addEventListener("click", () => {
        fila.remove();
        actualizarResumen();
    });

    fila.append(quitar);
    grupos[grupo].append(fila);
}

function leerServicios(grupo) {
    return [...grupos[grupo].querySelectorAll(".servicio")].map((fila) => {
        const valor = (nombre) =>
            fila.querySelector(`.servicio-${nombre}`)?.value.trim();

        return {
            codigo: valor("codigo"),
            nombre: valor("nombre"),
            precioUnitario: Number(valor("precio")),
            capacidadPersonas: grupo === "vuelos"
                ? 1
                : Number(valor("capacidad")),
            ...(grupo === "vuelos" ? { clase: valor("clase") } : {})
        };
    });
}

function seleccionInicial(opciones) {
    const resultado = {};

    for (const [campo, grupo] of [
        ["vuelo", "vuelos"],
        ["hospedaje", "hospedajes"],
        ["auto", "autos"]
    ]) {
        const anterior = editando?.seleccionInicial?.[campo];

        if (
            campo === "auto" &&
            anterior === null &&
            porId("permiteSinAuto").checked
        ) {
            resultado[campo] = null;
        } else {
            resultado[campo] =
                opciones[grupo].find((item) => item.codigo === anterior)?.codigo
                || opciones[grupo][0]?.codigo
                || null;
        }
    }

    return resultado;
}

function obtenerDatos() {
    const opciones = {
        vuelos: leerServicios("vuelos"),
        hospedajes: leerServicios("hospedajes"),
        autos: leerServicios("autos")
    };

    return {
        destino: porId("destino").value.trim(),
        pais: porId("pais").value.trim(),
        origen: editando?.origen || "Buenos Aires",
        tipo: porId("tipo").value,
        fechaEntrada: porId("fechaEntrada").value,
        fechaSalida: porId("fechaSalida").value,
        permiteSinAuto: porId("permiteSinAuto").checked,
        opciones,
        seleccionInicial: seleccionInicial(opciones)
    };
}

function actualizarResumen() {
    const datos = obtenerDatos();
    let totalCentavos = 0;

    for (const [campo, grupo] of [
        ["vuelo", "vuelos"],
        ["hospedaje", "hospedajes"],
        ["auto", "autos"]
    ]) {
        const seleccionado = datos.opciones[grupo].find(
            (item) => item.codigo === datos.seleccionInicial[campo]
        );

        if (seleccionado && Number.isFinite(seleccionado.precioUnitario)) {
            totalCentavos += Math.round(seleccionado.precioUnitario * 100);
        }
    }

    porId("precioInicial").value = (totalCentavos / 100).toFixed(2);

    const entrada = new Date(`${datos.fechaEntrada}T12:00:00Z`);
    const salida = new Date(`${datos.fechaSalida}T12:00:00Z`);
    const noches = Math.round((salida - entrada) / 86400000);

    porId("noches").value = noches > 0 ? noches : "";
    porId("diasEstadia").value = noches > 0 ? noches + 1 : "";
}

function limpiarFormulario() {
    form.reset();
    editando = null;

    Object.values(grupos).forEach((contenedor) => {
        contenedor.replaceChildren();
    });

    agregarServicio("vuelos");
    agregarServicio("hospedajes");

    porId("permiteSinAuto").checked = true;
    porId("tituloFormulario").textContent = "Crear nuevo paquete";
    porId("btnGuardar").textContent = "Crear paquete";
    porId("btnCancelar").classList.add("oculto");

    actualizarResumen();
}

function editarPaquete(paquete) {
    if (ocupado) return;

    limpiarFormulario();
    editando = paquete;

    for (const campo of [
        "destino", "pais", "tipo", "fechaEntrada", "fechaSalida"
    ]) {
        porId(campo).value = paquete[campo];
    }

    porId("permiteSinAuto").checked = paquete.permiteSinAuto;

    for (const grupo of Object.keys(grupos)) {
        grupos[grupo].replaceChildren();

        for (const servicio of paquete.opciones[grupo]) {
            agregarServicio(grupo, servicio);
        }
    }

    porId("tituloFormulario").textContent = "Modificar paquete";
    porId("btnGuardar").textContent = "Guardar cambios";
    porId("btnCancelar").classList.remove("oculto");

    actualizarResumen();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarPaquetes() {
    const texto = buscador.value.trim().toLocaleLowerCase("es");

    const filtrados = paquetes.filter((paquete) =>
        `${paquete.destino} ${paquete.pais} ${paquete.tipo}`
            .toLocaleLowerCase("es")
            .includes(texto)
    );

    lista.replaceChildren();
    porId("cantidadPaquetes").textContent = `${paquetes.length} paquetes`;

    if (!filtrados.length) {
        lista.append(elemento("p", "No hay paquetes para mostrar.", "sin-resultados"));
        return;
    }

    for (const paquete of filtrados) {
        const tarjeta = elemento("article", undefined, "paquete-card");

        tarjeta.append(
            elemento("h4", paquete.destino),
            elemento("span", paquete.tipo, "tipo"),
            elemento("p", paquete.pais),
            elemento("p", `${paquete.fechaEntrada} al ${paquete.fechaSalida}`),
            elemento("p", `${paquete.diasEstadia} días / ${paquete.noches} noches`),
            elemento("div", precio(paquete.precioInicial), "precio")
        );

        const botones = elemento("div", undefined, "paquete-botones");

        const editar = elemento("button", "Editar", "btn-editar");
        editar.type = "button";
        editar.addEventListener("click", () => editarPaquete(paquete));

        const eliminar = elemento("button", "Dar de baja", "btn-eliminar");
        eliminar.type = "button";

        eliminar.addEventListener("click", () => {
            if (ocupado) return;

            eliminando = paquete;
            porId("mensajeEliminar").textContent =
                `¿Dar de baja el paquete ${paquete.destino} · ${paquete.tipo}?`;

            modal.classList.remove("oculto");
        });

        botones.append(editar, eliminar);
        tarjeta.append(botones);
        lista.append(tarjeta);
    }
}

async function cargarPaquetes() {
    const datos = await api("/paquetes");

    if (!Array.isArray(datos.paquetes)) {
        throw new Error("La respuesta del catálogo no es válida.");
    }

    paquetes = datos.paquetes;
    mostrarPaquetes();
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (ocupado || !autorizado) return;

    const datos = obtenerDatos();

    if (!datos.opciones.vuelos.length || !datos.opciones.hospedajes.length) {
        avisar("Agregá al menos un vuelo y un hospedaje.");
        return;
    }

    if (!datos.permiteSinAuto && !datos.opciones.autos.length) {
        avisar("Agregá un auto o permití reservar sin auto.");
        return;
    }

    const id = editando?.id;
    let guardado = false;
    bloquear(true);

    try {
        await api(
            id ? `/paquetes/${encodeURIComponent(id)}` : "/paquetes",
            {
                method: id ? "PUT" : "POST",
                body: JSON.stringify(datos)
            }
        );

        guardado = true;
        limpiarFormulario();
        await cargarPaquetes();
        avisar("Paquete guardado en la base de datos.");
    } catch (error) {
        avisar(guardado
            ? "El paquete se guardó, pero falló la actualización del listado. Recargá la página."
            : `${error.message} Si se cortó la conexión, recargá y revisá el listado antes de repetir.`
        );
    } finally {
        bloquear(false);
    }
});

porId("btnConfirmarEliminar").addEventListener("click", async () => {
    if (ocupado || !autorizado || !eliminando) return;

    const id = eliminando.id;
    let eliminado = false;
    bloquear(true);

    try {
        await api(`/paquetes/${encodeURIComponent(id)}`, {
            method: "DELETE"
        });

        eliminado = true;
        modal.classList.add("oculto");
        eliminando = null;

        if (editando?.id === id) limpiarFormulario();

        await cargarPaquetes();
        avisar("Paquete dado de baja.");
    } catch (error) {
        avisar(eliminado
            ? "La baja se guardó. Recargá para actualizar el listado."
            : error.message
        );
    } finally {
        bloquear(false);
    }
});

porId("btnCancelarEliminar").addEventListener("click", () => {
    eliminando = null;
    modal.classList.add("oculto");
});

porId("btnCancelar").addEventListener("click", limpiarFormulario);
buscador.addEventListener("input", mostrarPaquetes);

for (const [boton, grupo] of [
    ["btnAgregarVuelo", "vuelos"],
    ["btnAgregarHospedaje", "hospedajes"],
    ["btnAgregarAuto", "autos"]
]) {
    porId(boton).addEventListener("click", () => {
        agregarServicio(grupo);
        actualizarResumen();
    });
}

form.addEventListener("input", actualizarResumen);
form.addEventListener("change", actualizarResumen);

async function iniciar() {
    for (const campo of ["precioInicial", "diasEstadia", "noches"]) {
        porId(campo).readOnly = true;
    }

    bloquear(true);

    try {
        await api("/sesion");
        autorizado = true;

        limpiarFormulario();
        await cargarPaquetes();
    } catch (error) {
        avisar(error.message);
    } finally {
        bloquear(false);
    }
}

porId("formDarAdmin").addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (ocupado || !autorizado) return;

    const nombre = porId("nombreNuevoAdmin").value.trim();
    const email = porId("emailNuevoAdmin").value.trim();
    const resultado = porId("resultadoDarAdmin");

    const confirma = window.confirm(
        `¿Dar permisos de administrador a ${nombre} (${email})?`
    );

    if (!confirma) return;

    bloquear(true);
    resultado.textContent = "Actualizando permisos…";

    try {
        const datos = await api("/usuarios/dar-admin", {
            method: "POST",
            body: JSON.stringify({ nombre, email })
        });

        resultado.textContent = datos.mensaje;
        porId("formDarAdmin").reset();
    } catch (error) {
        resultado.textContent = error.message;
    } finally {
        bloquear(false);
    }
});

iniciar();