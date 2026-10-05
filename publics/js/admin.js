const formPaquete = document.getElementById("formPaquete");
const listaPaquetes = document.getElementById("listaPaquetes");
const buscarPaquete = document.getElementById("buscarPaquete");
const cantidadPaquetes = document.getElementById("cantidadPaquetes");
const tituloFormulario = document.getElementById("tituloFormulario");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const btnAgregarVuelo = document.getElementById("btnAgregarVuelo");
const btnAgregarHospedaje = document.getElementById("btnAgregarHospedaje");
const btnAgregarAuto = document.getElementById("btnAgregarAuto");
const vuelosContainer = document.getElementById("vuelosContainer");
const hospedajesContainer = document.getElementById("hospedajesContainer");
const autosContainer = document.getElementById("autosContainer");
const modalEliminar = document.getElementById("modalEliminar");
const mensajeEliminar = document.getElementById("mensajeEliminar");
const btnCancelarEliminar =
    document.getElementById("btnCancelarEliminar");

const btnConfirmarEliminar =
    document.getElementById("btnConfirmarEliminar");

const mensaje = document.getElementById("mensaje");


/*
========================================
DATOS
========================================
*/

const CLAVE_PAQUETES = "pyflight_paquetes_admin";


let paquetes = [];

let paqueteEditando = null;

let paqueteEliminar = null;


/*
========================================
PAQUETES DE EJEMPLO
========================================
*/

const paquetesIniciales = [

    {
        id: crypto.randomUUID(),

        destino: "Miami",

        pais: "Estados Unidos",

        tipo: "Económico",

        diasEstadia: 7,

        noches: 6,

        fechaEntrada: "2026-11-10",

        fechaSalida: "2026-11-17",

        precioInicial: 500000,

        permiteSinAuto: true,

        opciones: {

            vuelos: [
                {
                    codigo: "MIAMI-ECO",
                    clase: "Clase económica",
                    nombre: "Vuelo económico",
                    precioUnitario: 150000,
                    capacidadPersonas: 1
                }
            ],

            hospedajes: [
                {
                    codigo: "MIAMI-HOTEL",
                    nombre: "Hotel Miami Beach",
                    precioUnitario: 180000,
                    capacidadPersonas: 2
                }
            ],

            autos: [
                {
                    codigo: "MIAMI-AUTO",
                    nombre: "Auto económico",
                    precioUnitario: 120000,
                    capacidadPersonas: 4
                }
            ]

        },

        seleccionInicial: {
            vuelo: "MIAMI-ECO",
            hospedaje: "MIAMI-HOTEL",
            auto: "MIAMI-AUTO"
        }
    },


    {
        id: crypto.randomUUID(),

        destino: "París",

        pais: "Francia",

        tipo: "All Inclusive",

        diasEstadia: 7,

        noches: 6,

        fechaEntrada: "2026-12-01",

        fechaSalida: "2026-12-08",

        precioInicial: 850000,

        permiteSinAuto: true,

        opciones: {

            vuelos: [
                {
                    codigo: "PARIS-ALL",
                    clase: "Primera clase",
                    nombre: "Vuelo París Premium",
                    precioUnitario: 350000,
                    capacidadPersonas: 1
                }
            ],

            hospedajes: [
                {
                    codigo: "PARIS-HOTEL",
                    nombre: "Hotel Paris Luxury",
                    precioUnitario: 350000,
                    capacidadPersonas: 2
                }
            ],

            autos: [
                {
                    codigo: "PARIS-AUTO",
                    nombre: "BMW X6",
                    precioUnitario: 150000,
                    capacidadPersonas: 5
                }
            ]

        },

        seleccionInicial: {
            vuelo: "PARIS-ALL",
            hospedaje: "PARIS-HOTEL",
            auto: "PARIS-AUTO"
        }
    }

];


/*
========================================
INICIAR
========================================
*/

function iniciar() {

    cargarPaquetes();

    limpiarFormulario();

    mostrarPaquetes();

}


/*
========================================
LOCAL STORAGE
========================================
*/

function cargarPaquetes() {

    try {

        const guardados =
            JSON.parse(
                localStorage.getItem(CLAVE_PAQUETES)
            );

        if (Array.isArray(guardados)) {

            paquetes = guardados;

        } else {

            paquetes = paquetesIniciales;

            guardarPaquetes();

        }

    } catch {

        paquetes = paquetesIniciales;

        guardarPaquetes();

    }

}


function guardarPaquetes() {

    localStorage.setItem(
        CLAVE_PAQUETES,
        JSON.stringify(paquetes)
    );

}


/*
========================================
FORMULARIO
========================================
*/

function obtenerDatosFormulario() {

    const destino =
        document.getElementById("destino").value.trim();

    const pais =
        document.getElementById("pais").value.trim();

    const tipo =
        document.getElementById("tipo").value;

    const precioInicial =
        Number(
            document.getElementById("precioInicial").value
        );

    const diasEstadia =
        Number(
            document.getElementById("diasEstadia").value
        );

    const noches =
        Number(
            document.getElementById("noches").value
        );

    const fechaEntrada =
        document.getElementById("fechaEntrada").value;

    const fechaSalida =
        document.getElementById("fechaSalida").value;

    const permiteSinAuto =
        document.getElementById("permiteSinAuto").checked;


    const vuelos =
        obtenerServicios(vuelosContainer);

    const hospedajes =
        obtenerServicios(hospedajesContainer);

    const autos =
        obtenerServicios(autosContainer);


    return {

        id:
            paqueteEditando
                ? paqueteEditando.id
                : crypto.randomUUID(),

        destino,

        pais,

        tipo,

        diasEstadia,

        noches,

        fechaEntrada,

        fechaSalida,

        precioInicial,

        permiteSinAuto,

        opciones: {

            vuelos,

            hospedajes,

            autos

        },

        seleccionInicial: {

            vuelo:
                vuelos[0]?.codigo || null,

            hospedaje:
                hospedajes[0]?.codigo || null,

            auto:
                autos[0]?.codigo || null

        }

    };

}


/*
========================================
SERVICIOS
========================================
*/

function obtenerServicios(container) {

    const elementos =
        container.querySelectorAll(".servicio");


    return [...elementos].map((elemento) => {

        const codigo =
            elemento.querySelector(".servicio-codigo").value.trim();

        const nombre =
            elemento.querySelector(".servicio-nombre").value.trim();

        const precio =
            Number(
                elemento.querySelector(".servicio-precio").value
            );

        const capacidad =
            Number(
                elemento.querySelector(".servicio-capacidad").value
            );


        const claseInput =
            elemento.querySelector(".servicio-clase");


        const clase =
            claseInput
                ? claseInput.value.trim()
                : undefined;


        const servicio = {

            codigo,

            nombre,

            precioUnitario: precio,

            capacidadPersonas: capacidad

        };


        if (claseInput) {

            servicio.clase = clase;

        }


        return servicio;

    });

}


/*
========================================
AGREGAR VUELO
========================================
*/

btnAgregarVuelo.addEventListener(
    "click",
    () => {

        crearServicio(
            vuelosContainer,
            "vuelo"
        );

    }
);


/*
========================================
AGREGAR HOSPEDAJE
========================================
*/

btnAgregarHospedaje.addEventListener(
    "click",
    () => {

        crearServicio(
            hospedajesContainer,
            "hospedaje"
        );

    }
);


/*
========================================
AGREGAR AUTO
========================================
*/

btnAgregarAuto.addEventListener(
    "click",
    () => {

        crearServicio(
            autosContainer,
            "auto"
        );

    }
);


/*
========================================
CREAR SERVICIO
========================================
*/

function crearServicio(
    container,
    tipo,
    datos = null
) {

    const bloque =
        document.createElement("div");

    bloque.className = "servicio";


    const codigo =
        crearCampoServicio(
            "Código",
            "servicio-codigo",
            datos?.codigo || ""
        );


    const nombre =
        crearCampoServicio(
            "Nombre",
            "servicio-nombre",
            datos?.nombre || ""
        );


    const precio =
        crearCampoServicio(
            "Precio",
            "servicio-precio",
            datos?.precioUnitario ?? "",
            "number"
        );


    const capacidad =
        crearCampoServicio(
            "Capacidad",
            "servicio-capacidad",
            datos?.capacidadPersonas ?? "",
            "number"
        );


    bloque.append(
        codigo,
        nombre,
        precio,
        capacidad
    );


    /*
    SOLO LOS VUELOS TIENEN CLASE
    */

    if (tipo === "vuelo") {

        const clase =
            crearCampoServicio(
                "Clase",
                "servicio-clase",
                datos?.clase || ""
            );

        bloque.insertBefore(
            clase,
            bloque.lastElementChild
        );

    }


    const boton =
        document.createElement("button");

    boton.type = "button";

    boton.className = "btn-remover";

    boton.textContent = "Eliminar";


    boton.addEventListener(
        "click",
        () => bloque.remove()
    );


    bloque.append(boton);


    container.append(bloque);

}


function crearCampoServicio(
    labelTexto,
    clase,
    valor,
    tipo = "text"
) {

    const contenedor =
        document.createElement("div");

    contenedor.className = "campo";


    const label =
        document.createElement("label");

    label.textContent = labelTexto;


    const input =
        document.createElement("input");

    input.type = tipo;

    input.className = clase;

    input.value = valor;


    if (tipo === "number") {

        input.min = "0";

        input.step = "0.01";

    }


    contenedor.append(
        label,
        input
    );


    return contenedor;

}


/*
========================================
GUARDAR PAQUETE
========================================
*/

formPaquete.addEventListener(
    "submit",
    (evento) => {

        evento.preventDefault();


        const paquete =
            obtenerDatosFormulario();


        if (
            !paquete.destino ||
            !paquete.pais ||
            !paquete.tipo
        ) {

            mostrarMensaje(
                "Completá todos los campos obligatorios."
            );

            return;

        }


        if (
            paquete.diasEstadia < 1 ||
            paquete.noches < 0
        ) {

            mostrarMensaje(
                "La cantidad de días o noches no es válida."
            );

            return;

        }


        if (
            paquete.fechaSalida &&
            paquete.fechaEntrada &&
            paquete.fechaSalida < paquete.fechaEntrada
        ) {

            mostrarMensaje(
                "La fecha de salida no puede ser anterior a la entrada."
            );

            return;

        }


        if (paqueteEditando) {

            const indice =
                paquetes.findIndex(
                    (item) =>
                        item.id === paqueteEditando.id
                );


            if (indice !== -1) {

                paquetes[indice] = paquete;

                mostrarMensaje(
                    "Paquete modificado correctamente."
                );

            }

        } else {

            paquetes.push(paquete);

            mostrarMensaje(
                "Paquete creado correctamente."
            );

        }


        guardarPaquetes();

        limpiarFormulario();

        mostrarPaquetes();

    }
);


/*
========================================
EDITAR
========================================
*/

function editarPaquete(id) {

    const paquete =
        paquetes.find(
            (item) => item.id === id
        );


    if (!paquete) return;


    paqueteEditando = paquete;


    document.getElementById("destino").value =
        paquete.destino;

    document.getElementById("pais").value =
        paquete.pais;

    document.getElementById("tipo").value =
        paquete.tipo;

    document.getElementById("precioInicial").value =
        paquete.precioInicial;

    document.getElementById("diasEstadia").value =
        paquete.diasEstadia;

    document.getElementById("noches").value =
        paquete.noches;

    document.getElementById("fechaEntrada").value =
        paquete.fechaEntrada;

    document.getElementById("fechaSalida").value =
        paquete.fechaSalida;

    document.getElementById("permiteSinAuto").checked =
        paquete.permiteSinAuto;


    vuelosContainer.replaceChildren();

    hospedajesContainer.replaceChildren();

    autosContainer.replaceChildren();


    paquete.opciones?.vuelos?.forEach(
        (vuelo) => {

            crearServicio(
                vuelosContainer,
                "vuelo",
                vuelo
            );

        }
    );


    paquete.opciones?.hospedajes?.forEach(
        (hospedaje) => {

            crearServicio(
                hospedajesContainer,
                "hospedaje",
                hospedaje
            );

        }
    );


    paquete.opciones?.autos?.forEach(
        (auto) => {

            crearServicio(
                autosContainer,
                "auto",
                auto
            );

        }
    );


    tituloFormulario.textContent =
        "Modificar paquete";


    btnGuardar.textContent =
        "Guardar cambios";


    btnCancelar.classList.remove(
        "oculto"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/*
========================================
CANCELAR EDICIÓN
========================================
*/

btnCancelar.addEventListener(
    "click",
    () => {

        limpiarFormulario();

    }
);


/*
========================================
LIMPIAR FORMULARIO
========================================
*/

function limpiarFormulario() {

    formPaquete.reset();


    paqueteEditando = null;


    tituloFormulario.textContent =
        "Crear nuevo paquete";


    btnGuardar.textContent =
        "Crear paquete";


    btnCancelar.classList.add(
        "oculto"
    );


    vuelosContainer.replaceChildren();

    hospedajesContainer.replaceChildren();

    autosContainer.replaceChildren();


    /*
    AGREGAMOS UN SERVICIO VACÍO
    */

    crearServicio(
        vuelosContainer,
        "vuelo"
    );

    crearServicio(
        hospedajesContainer,
        "hospedaje"
    );

    crearServicio(
        autosContainer,
        "auto"
    );


    document.getElementById(
        "permiteSinAuto"
    ).checked = true;

}


/*
========================================
ELIMINAR
========================================
*/

function eliminarPaquete(id) {

    const paquete =
        paquetes.find(
            (item) => item.id === id
        );


    if (!paquete) return;


    paqueteEliminar = paquete;


    mensajeEliminar.textContent =
        `¿Seguro que querés eliminar el paquete de ${paquete.destino}?`;


    modalEliminar.classList.remove(
        "oculto"
    );

}


/*
========================================
CONFIRMAR ELIMINACIÓN
========================================
*/

btnConfirmarEliminar.addEventListener(
    "click",
    () => {

        if (!paqueteEliminar) return;


        paquetes =
            paquetes.filter(
                (item) =>
                    item.id !== paqueteEliminar.id
            );


        guardarPaquetes();

        mostrarPaquetes();

        mostrarMensaje(
            "Paquete eliminado correctamente."
        );


        cerrarModalEliminar();

    }
);


/*
========================================
CANCELAR ELIMINACIÓN
========================================
*/

btnCancelarEliminar.addEventListener(
    "click",
    cerrarModalEliminar
);


function cerrarModalEliminar() {

    paqueteEliminar = null;

    modalEliminar.classList.add(
        "oculto"
    );

}


/*
========================================
MOSTRAR PAQUETES
========================================
*/

function mostrarPaquetes() {

    const texto =
        buscarPaquete.value
            .trim()
            .toLocaleLowerCase("es");


    const filtrados =
        paquetes.filter(
            (paquete) => {

                const contenido =
                    `${paquete.destino}
                     ${paquete.pais}
                     ${paquete.tipo}`
                        .toLocaleLowerCase("es");


                return contenido.includes(texto);

            }
        );


    listaPaquetes.replaceChildren();


    cantidadPaquetes.textContent =
        `${paquetes.length} ${
            paquetes.length === 1
                ? "paquete"
                : "paquetes"
        }`;


    if (!filtrados.length) {

        const mensaje =
            document.createElement("p");

        mensaje.className =
            "sin-resultados";

        mensaje.textContent =
            "No se encontraron paquetes.";

        listaPaquetes.append(mensaje);

        return;

    }


    filtrados.forEach(
        (paquete) => {

            listaPaquetes.append(
                crearTarjetaPaquete(paquete)
            );

        }
    );

}


/*
========================================
CREAR TARJETA
========================================
*/

function crearTarjetaPaquete(paquete) {

    const tarjeta =
        document.createElement("article");

    tarjeta.className =
        "paquete-card";


    const arriba =
        document.createElement("div");

    arriba.className =
        "paquete-arriba";


    const titulo =
        document.createElement("h4");

    titulo.textContent =
        paquete.destino;


    const tipo =
        document.createElement("span");

    tipo.className =
        "tipo";

    tipo.textContent =
        paquete.tipo;


    arriba.append(
        titulo,
        tipo
    );


    const informacion =
        document.createElement("div");

    informacion.className =
        "paquete-info";


    informacion.append(

        crearInfo(
            "País",
            paquete.pais
        ),

        crearInfo(
            "Duración",
            `${paquete.diasEstadia} días / ${paquete.noches} noches`
        ),

        crearInfo(
            "Entrada",
            formatearFecha(
                paquete.fechaEntrada
            )
        ),

        crearInfo(
            "Salida",
            formatearFecha(
                paquete.fechaSalida
            )
        )

    );


    const precio =
        document.createElement("div");

    precio.className =
        "precio";

    precio.textContent =
        formatearPrecio(
            paquete.precioInicial
        );


    const botones =
        document.createElement("div");

    botones.className =
        "paquete-botones";


    const editar =
        document.createElement("button");

    editar.type = "button";

    editar.className =
        "btn-editar";

    editar.textContent =
        "Editar";


    editar.addEventListener(
        "click",
        () => editarPaquete(paquete.id)
    );


    const eliminar =
        document.createElement("button");

    eliminar.type = "button";

    eliminar.className =
        "btn-eliminar";

    eliminar.textContent =
        "Eliminar";


    eliminar.addEventListener(
        "click",
        () => eliminarPaquete(paquete.id)
    );


    botones.append(
        editar,
        eliminar
    );


    tarjeta.append(
        arriba,
        informacion,
        precio,
        botones
    );


    return tarjeta;

}


/*
========================================
INFO DE TARJETA
========================================
*/

function crearInfo(
    titulo,
    valor
) {

    const div =
        document.createElement("div");

    div.className =
        "info";


    const span =
        document.createElement("span");

    span.textContent =
        titulo;


    const strong =
        document.createElement("strong");

    strong.textContent =
        valor;


    div.append(
        span,
        strong
    );


    return div;

}


/*
========================================
BUSCADOR
========================================
*/

buscarPaquete.addEventListener(
    "input",
    mostrarPaquetes
);


/*
========================================
MENSAJE
========================================
*/

function mostrarMensaje(texto) {

    mensaje.textContent =
        texto;


    mensaje.classList.add(
        "mostrar"
    );


    setTimeout(
        () => {

            mensaje.classList.remove(
                "mostrar"
            );

        },
        3000
    );

}


/*
========================================
PRECIO
========================================
*/

function formatearPrecio(valor) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS"
        }
    ).format(valor);

}


/*
========================================
FECHA
========================================
*/

function formatearFecha(fecha) {

    if (!fecha) return "-";


    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return fecha;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/*
========================================
INICIAR
========================================
*/

iniciar();

