const contenedor = document.getElementById("contenedorPaquetes");
const inputBusqueda = document.getElementById("busqueda");
const carritoElemento = document.getElementById("carrito");
const productosCarrito = document.getElementById("productosCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const mensajeCarrito = document.getElementById("mensajeCarrito");


const CLAVE_CARRITO = "olimpiadas_carrito_v2";

const formatoPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
});

let paquetes = [];
let carrito = [];

const botonConfirmar = document.getElementById("confirmarPedido");
const CLAVE_INTENTO = "pyflight_intento_compra_v1";

let enviandoCompra = false;
let intentoCompra = null;

try {
    intentoCompra = JSON.parse(sessionStorage.getItem(CLAVE_INTENTO) || "null");
} catch {
    intentoCompra = null;
}

function precio(centavos) {return formatoPrecio.format(centavos / 100);}

function centavos(valor) {return Math.round(Number(valor) * 100);}


function crearElemento(etiqueta, texto, clase) {
    const elemento = document.createElement(etiqueta);

    if (texto !== undefined) elemento.textContent = texto;
    if (clase) elemento.className = clase;

    return elemento;
}

function crearBoton(texto, clase, accion) {
    const boton = crearElemento("button", texto, clase);
    boton.type = "button";
    boton.addEventListener("click", accion);
    return boton;
}

function buscarPaquete(id) {return paquetes.find((paquete) => paquete.id === id);}

function obtenerServicios(paquete, seleccion) {
    return {
        vuelo: paquete.opciones.vuelos.find((opcion) => opcion.codigo === seleccion.vuelo),
        hospedaje: paquete.opciones.hospedajes.find((opcion) => opcion.codigo === seleccion.hospedaje),
        auto: seleccion.auto === null ? null : paquete.opciones.autos.find((opcion) => opcion.codigo === seleccion.auto)
    };
}

function seleccionValida(paquete, seleccion) {
    if (!seleccion || typeof seleccion !== "object") return false;
    const { vuelo, hospedaje, auto } = obtenerServicios(paquete, seleccion);

    return Boolean(vuelo && hospedaje && (seleccion.auto === null ? paquete.permiteSinAuto : auto));
}

function calcular(paquete, item) {
    const servicios = obtenerServicios(paquete, item.seleccion);

    const cantidadHospedajes = Math.ceil(item.viajeros / servicios.hospedaje.capacidadPersonas);

    const cantidadAutos = servicios.auto ? Math.ceil(item.viajeros / servicios.auto.capacidadPersonas) : 0;

    const totalVuelos = item.viajeros * centavos(servicios.vuelo.precioUnitario);

    const totalHospedajes = cantidadHospedajes * centavos(servicios.hospedaje.precioUnitario);

    const totalAutos = servicios.auto ? cantidadAutos * centavos(servicios.auto.precioUnitario) : 0;

    return {
        ...servicios,
        cantidadHospedajes,
        cantidadAutos,
        totalVuelos,
        totalHospedajes,
        totalAutos,
        total: totalVuelos + totalHospedajes + totalAutos
    };
}

function guardarCarrito() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch {
        mensajeCarrito.textContent = "El navegador no pudo guardar el carrito para otra visita.";
    }
}

function recuperarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");

        if (!Array.isArray(guardado)) {throw new Error("Formato de carrito inválido");}

        let descartados = 0;

        carrito = guardado.flatMap((item) => { 
            const paquete = buscarPaquete(item?.paqueteId);

            if (!paquete || !Number.isInteger(item.viajeros) || item.viajeros < 1 || item.viajeros > 100 || !seleccionValida(paquete, item.seleccion)) {
                descartados++;
                return [];
            }

            return [{
                id: crypto.randomUUID(),
                paqueteId: paquete.id,
                viajeros: item.viajeros,
                seleccion: {
                    vuelo: item.seleccion.vuelo,
                    hospedaje: item.seleccion.hospedaje,
                    auto: item.seleccion.auto
                }
            }];
        });

        if (descartados) {mensajeCarrito.textContent = "Se quitaron selecciones guardadas que ya no están disponibles.";}
    } catch {
        carrito = [];
        mensajeCarrito.textContent = "No se pudo recuperar el carrito anterior.";
    }
}

function mostrarPaquetes() {
    const texto = inputBusqueda.value.trim().toLocaleLowerCase("es");

    const filtrados = paquetes.filter((paquete) => `${paquete.destino} ${paquete.pais} ${paquete.tipo}`
            .toLocaleLowerCase("es")
            .includes(texto)
    );

    contenedor.replaceChildren();

    if (!filtrados.length) {
        contenedor.append(crearElemento("p", "No encontramos ese destino.", "sin-resultados"));
        return;
    }

    filtrados.forEach((paquete) => {
        const servicios = obtenerServicios(paquete,paquete.seleccionInicial);

        const tarjeta = crearElemento("article", undefined, "card");

        tarjeta.append(
            crearElemento("h1", paquete.destino, "tipo"),
            crearElemento("h3", paquete.tipo),
            crearElemento("p", `País: ${paquete.pais}`),
            crearElemento("p", `Vuelo: ${servicios.vuelo.clase}`),
            crearElemento("p", `Hotel: ${servicios.hospedaje.nombre}`),
            crearElemento("p", servicios.auto?.nombre || "Sin auto"),
            crearElemento("p", `${paquete.diasEstadia} días, ${paquete.noches} noches de estadía`),
            crearElemento("small", `Estadía: ${paquete.fechaEntrada} al ${paquete.fechaSalida}`),
            crearElemento("div", `${precio(centavos(paquete.precioInicial))} ARS`, "precio"),
            crearElemento("small", "Total inicial para 1 viajero. Personalizá los servicios en el carrito."),
            crearElemento("small", "Paquete de demostración."),
            crearBoton("Agregar al carrito", "btn-agregar", () => agregarAlCarrito(paquete))
        );
        contenedor.append(tarjeta);
    });
    actualizarControlesCompra();
}

function agregarAlCarrito(paquete) {
    carrito.push({
        id: crypto.randomUUID(),
        paqueteId: paquete.id,
        viajeros: 1,
        seleccion: { ...paquete.seleccionInicial }
    });

    mensajeCarrito.textContent = "";
    guardarCarrito();
    mostrarCarrito();
    carritoElemento.classList.add("abierto");
}

function crearSelector(item, titulo, campo, opciones, permiteSinAuto) {
    const etiqueta = crearElemento("label", undefined, "campo-carrito");
    const selector = document.createElement("select");

    etiqueta.append(crearElemento("span", titulo));

    if (permiteSinAuto) {selector.add(new Option("Sin auto", ""));}

    opciones.forEach((opcion) => {const capacidad = opcion.capacidadPersonas ? ` · hasta ${opcion.capacidadPersonas} personas` : "";

        selector.add(new Option(`${opcion.nombre}${capacidad} · ${precio(centavos(opcion.precioUnitario))}`,
            opcion.codigo
        ));
    });

    selector.value = item.seleccion[campo] ?? "";

    selector.addEventListener("change", () => {
        item.seleccion[campo] = selector.value || null;
        mensajeCarrito.textContent = "Selección actualizada.";
        guardarCarrito();
        mostrarCarrito();
    });

    etiqueta.append(selector);
    return etiqueta;
}

function mostrarCarrito() {
    productosCarrito.replaceChildren();

    let total = 0;
    let viajerosTotales = 0;

    if (!carrito.length) {
        productosCarrito.append(crearElemento("p", "Tu carrito está vacío.", "precio"));
    }

    carrito.forEach((item) => {
        const paquete = buscarPaquete(item.paqueteId);
        const calculo = calcular(paquete, item);

        total += calculo.total;
        viajerosTotales += item.viajeros;

        const personalizado = ["vuelo", "hospedaje", "auto"].some((campo) => item.seleccion[campo] !== paquete.seleccionInicial[campo]);

        const bloque = crearElemento("div", undefined, "producto-carrito");

        bloque.append(crearElemento("h4",`${paquete.destino} · ${paquete.tipo}`,"destinoP"));

        if (personalizado) {
            bloque.append(crearElemento("p", "Personalizado"));
        }

        const campoViajeros = crearElemento("label", undefined, "campo-carrito");

        const viajeros = document.createElement("input");
        viajeros.type = "number";
        viajeros.min = "1";
        viajeros.max = "100";
        viajeros.step = "1";
        viajeros.value = item.viajeros;

        viajeros.addEventListener("change", () => {
            const cantidad = Number(viajeros.value);

            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
                viajeros.value = item.viajeros;
                mensajeCarrito.textContent = "Ingresá entre 1 y 100 viajeros.";
                return;
            }

            item.viajeros = cantidad;
            mensajeCarrito.textContent = "Cantidad de viajeros actualizada.";
            guardarCarrito();
            mostrarCarrito();
        });

        campoViajeros.append( crearElemento("span", "Cantidad de viajeros"), viajeros);

        bloque.append(
            campoViajeros, 
            crearSelector(item, "Vuelo", "vuelo", paquete.opciones.vuelos, false),
            crearSelector(item, "Hospedaje", "hospedaje", paquete.opciones.hospedajes, false),
            crearSelector(item, "Vehículo", "auto", paquete.opciones.autos, paquete.permiteSinAuto),
            crearElemento("p", `${item.viajeros} pasaje(s): ${precio(calculo.totalVuelos)}`),
            crearElemento("p", `${calculo.cantidadHospedajes} unidad(es) de hospedaje: ${precio(calculo.totalHospedajes)}`),
            crearElemento("p", `${calculo.cantidadAutos} vehículo(s): ${precio(calculo.totalAutos)}`)
        );

        if (calculo.cantidadHospedajes > 1 || calculo.cantidadAutos > 1) {
            const aviso = crearElemento("p", `Por la capacidad elegida, el grupo necesita ${calculo.cantidadHospedajes} unidad(es) de hospedaje y 
                ${calculo.cantidadAutos} vehículo(s). El total ya incluye estas cantidades.`, "aviso-capacidad"
            );

            aviso.setAttribute("role", "status");
            bloque.append(aviso);
        }

        bloque.append(
            crearElemento("strong", `Subtotal: ${precio(calculo.total)} ARS`, "precio"),
            crearBoton("Eliminar", "eliminar", () => {carrito = carrito.filter((seleccion) => seleccion.id !== item.id);
                mensajeCarrito.textContent = "";
                guardarCarrito();
                mostrarCarrito();
            })
        );
        productosCarrito.append(bloque);
    });

    totalCarrito.textContent = `${precio(total)} ARS`;
    cantidadCarrito.textContent = viajerosTotales;
    cantidadCarrito.title = "Total de viajeros sumados entre las selecciones";

    actualizarControlesCompra();
}

inputBusqueda.addEventListener("input", mostrarPaquetes);

document.getElementById("btnCarrito").addEventListener("click", () => {carritoElemento.classList.add("abierto");});

document.getElementById("cerrarCarrito").addEventListener("click", () => {carritoElemento.classList.remove("abierto");});

document.getElementById("vaciarCarrito").addEventListener("click", () => {
    carrito = [];
    mensajeCarrito.textContent = "";
    guardarCarrito();
    mostrarCarrito();
});

botonConfirmar.addEventListener("click", confirmarCompra);

function actualizarControlesCompra() {
    const bloqueado = enviandoCompra || Boolean(intentoCompra);

    document.querySelectorAll(
        "#productosCarrito input, " + "#productosCarrito select, " + "#productosCarrito button, " + "#contenedorPaquetes button, " + "#vaciarCarrito"
    ).forEach((control) => {
        control.disabled = bloqueado;
    });

    botonConfirmar.disabled = enviandoCompra || (!carrito.length && !intentoCompra);

    botonConfirmar.textContent = enviandoCompra ? "Procesando compra…" : intentoCompra ? "Reintentar confirmación" : "Confirmar compra";
}

function borrarIntentoCompra() {
    sessionStorage.removeItem(CLAVE_INTENTO);
    intentoCompra = null;
}

async function confirmarCompra() {
    if (enviandoCompra || (!carrito.length && !intentoCompra)) {
        return;
    }

    if (!intentoCompra) {
        const total = carrito.reduce((acumulado, item) => {
            const paquete = buscarPaquete(item.paqueteId);
            return acumulado + calcular(paquete, item).total;
        }, 0);

        const acepta = window.confirm(`¿Confirmar la compra por ${precio(total)} ARS?`);

        if (!acepta) return;

        const nuevoIntento = {
            clave: crypto.randomUUID(),

            items: carrito.map((item) => ({paqueteId: item.paqueteId, viajeros: item.viajeros, seleccion: { ...item.seleccion }})),

            totalEsperadoCentavos: total
        };

        try {
            sessionStorage.setItem(CLAVE_INTENTO, JSON.stringify(nuevoIntento));
            intentoCompra = nuevoIntento;
        } catch {
            mensajeCarrito.textContent ="Habilitá el almacenamiento del navegador para confirmar la compra.";
            return;
        }
    }

    enviandoCompra = true;
    actualizarControlesCompra();

    mensajeCarrito.textContent ="Guardando la compra y enviando el comprobante…";

    try {
        const respuesta = await fetch("/api/pedidos", {
            method: "POST",
            credentials: "same-origin",

            headers: {"Content-Type": "application/json"},

            body: JSON.stringify(intentoCompra),

            signal: AbortSignal.timeout(45000)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            if ([400, 401, 409, 415, 422, 429].includes(respuesta.status)) {
                borrarIntentoCompra();
            }

            if (respuesta.status === 401) {
                window.location.href = "login.html";
                return;
            }

            throw new Error(datos.mensaje || "No se pudo confirmar la compra.");
        }

        if (!datos.pedido?.numero_pedido) {throw new Error("La respuesta del servidor no es válida.");}

        localStorage.removeItem(CLAVE_CARRITO);
        borrarIntentoCompra();

        carrito = [];
        mostrarCarrito();

        const numeroComprobante = datos.factura?.numero_factura || datos.pedido.numero_pedido;

        const estado = datos.pedido.nombre_estado.replaceAll("_", " ");

        const avisoCorreo = datos.correo === "enviado" ? "El servicio de correo aceptó el envío del comprobante." : "El correo no está confirmado. La compra permanece guardada.";

        mensajeCarrito.textContent =`Pedido registrado. Comprobante: ${numeroComprobante}. ` + `Estado: ${estado}. ` + `Total: ${formatoPrecio.format(Number(datos.pedido.monto_total))} ARS. ${avisoCorreo}`;

    } catch (error) {
        mensajeCarrito.textContent = intentoCompra ? "No pudimos confirmar el resultado. Pulsá Reintentar confirmación para recuperar el mismo pedido sin duplicarlo." : error.message;

    } finally {
        enviandoCompra = false;
        actualizarControlesCompra();
    }
}

async function iniciar() {
    inputBusqueda.disabled = true;
    contenedor.replaceChildren(crearElemento("p", "Cargando paquetes...", "sin-resultados"));

    try {
        const respuesta = await fetch("/api/paquetes", {cache: "no-store"});

        if (!respuesta.ok) {throw new Error("No se pudo obtener el catálogo");}

        const datos = await respuesta.json();

        if (!Array.isArray(datos.paquetes)) {throw new Error("Respuesta de catálogo inválida");}

        paquetes = datos.paquetes;
        recuperarCarrito();
        mostrarPaquetes();
        mostrarCarrito();
        inputBusqueda.disabled = false;
        if (intentoCompra) {
            mensajeCarrito.textContent ="Hay una confirmación sin resolver. Pulsá Reintentar confirmación para consultar el resultado.";
            carritoElemento.classList.add("abierto");
        }
    } catch (error) {
        console.error(error);

        contenedor.replaceChildren(
            crearElemento("p","No se pudieron cargar los paquetes. Recargá la página para reintentar.","sin-resultados")
        );
    }
}

iniciar();