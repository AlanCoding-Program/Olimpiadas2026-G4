const paquetes = [
    //Ibiza
    {
        id: 1,
        destino: "Ibiza",
        pais: "España",
        tipo: "económico",
        precio: 850,
        hotel: "Hotel Vibra Mare Nostrum",
        auto: "Sin auto"
    },
    {
        id: 2,
        destino: "Ibiza",
        pais: "España",
        tipo: "Intermedio",
        precio: 1450,
        hotel: "Hotel Torre del Mar",
        auto: "Volkswagen Golf"
    },
    {
        id: 3,
        destino: "Ibiza",
        pais: "España",
        tipo: "All Inclusive",
        precio: 3500,
        hotel: "Nobu Hotel Ibiza Bay",
        auto: "Porsche 911 Carrera"
    },
    //Londres
    {
        id: 4,
        destino: "Londres",
        pais: "Inglaterra",
        tipo: "Económico",
        precio: 900,
        hotel: "Ibis London City",
        auto: "Sin auto"
    },
    {
        id: 5,
        destino: "Londres",
        pais: "Inglaterra",
        tipo: "Intermedio",
        precio: 1700,
        hotel: "Novotel London Waterloo",
        auto: "BMW Serie 3"
    },
    {
        id: 6,
        destino: "Londres",
        pais: "Inglaterra",
        tipo: "All inclusive",
        precio: 4200,
        hotel: "The Savoy",
        auto: "Bentley Continental GT"
    },
    //Paris
    {
        id: 7,
        destino: "Paris",
        pais: "Francia",
        tipo: "Económico",
        precio: 850,
        hotel: "Ibis Budget Paris Porte de Montmartre",
        auto: "Sin auto"
    },
    {
        id: 8,
        destino: "Paris",
        pais: "Francia",
        tipo: "Intermedio",
        precio: 1650,
        hotel: "Novotel Paris Centre Tour Eiffel",
        auto: "Mercedez-Benz Clase C"
    },
    {
        id: 9,
        destino: "París",
        pais: "Francia",
        tipo: "All inclusive",
        precio: 4500,
        hotel: "Ritz Paris",
        auto: "Porsche Carrera"
    },
    //Buenos Aires
    {
        id: 10,
        destino: "Buenos Aires",
        pais: "Argentina",
        tipo: "Económico",
        precio: 400,
        hotel: "Ibis Buenos Aires Congreso",
        auto: "Sin Auto"
    },
    {
        id: 11,
        destino: "Buenos Aires",
        pais: "Argentina",
        tipo: "Intermedio",
        precio: 800,
        hotel: "Dazzler Buenos Aires Palermo",
        auto: "Toyota Corolla"
    },
    {
        id: 12,
        destino: "Buenos Aires",
        pais: "Argentina",
        tipo: "All Inclusive",
        precio: 2200,
        hotel: "Park Tower Buenos Aires",
        auto: "BMW M4"
    },
    //Estambul
    {
        id: 13,
        destino: "Estambul",
        pais: "Turquía",
        tipo: "Económico",
        precio: 700,
        hotel: "Ibis Styles Istanbul Bomonti",
        auto: "Sin auto"
    },
    {
        id: 14,
        destino: "Estambul",
        pais: "Turquía",
        tipo: "Intermedio",
        precio: 1300,
        hotel: "Novotel Istanbul Bosphorus",
        auto: "Mercedez-Benz Clase E"
    },
    {
        id: 15,
        destino: "Estambul",
        pais: "Turquía",
        tipo: "ALl Inclusive",
        precio: 3200,
        hotel: "JW Marriott Instanbul Bosphorus",
        auto: "Porsche Cayenne"
    },
    //Roma
    {
        id: 16,
        destino: "Roma",
        pais: "Italia",
        tipo: "Económico",
        precio: 800,
        hotel: "Ibis Styles Roma Aurelia",
        auto: "Sin auto"
    },
    {
        id: 17,
        destino: "Roma",
        pais: "Italia",
        tipo: "Intermedio",
        precio: 1500,
        hotel: "NH Collection Roma Palazzo Cinquecento",
        auto: "Audi A4"
    },
    {
        id: 18,
        destino: "Roma",
        pais: "Italia",
        tipo: "All inclusive",
        precio: 4000,
        hotel: "Bvlgari Hotel Roma",
        auto: "Ferrari Roma"
    },
    //Dubai
    {
        id: 19,
        destino: "Roma",
        pais: "Italia",
        tipo: "Económico",
        precio: 1000,
        hotel: "Ibis One Central",
        auto: "Sin auto"
    },
    {
        id: 20, 
        destino: "Dubai",
        pais: "Émiratos Árabes Unidos",
        tipo: "Intermedio",
        precio: 1900,
        hotel: "Aloft Palm Jumeirah",
        auto: "BMW Serie 5"
    },
    {
        id: 21,
        destino: "Dubai",
        pais: "Émiratos Árabes Unidos",
        tipo: "All Inclusive",
        precio: 5000,
        hotel: "JW Marriott Marquis Dubai",
        auto: "Lamborghini Urus"
    },
    //Berlin
    {
        id: 22,
        destino: "Berlín",
        pais: "Alemania",
        tipo: "Económico",
        precio: 850,
        hotel: "Ibis Budget Berlín Alexanderplatz",
        auto: "Sin Auto"
    },
    {
        id: 23,
        destino: "Berlín",
        pais: "Alemnia",
        tipo: "Intermedio",
        precio: 1500,
        hotel: "Novotel Berlin Mitte",
        auto: "Volkswagen Passat"
    },
    {
        id: 24,
        destino: "Berlín",
        pais: "Alemania",
        tipo: "All Inclusive",
        precio: 3800,
        hotel: "Hotel Adlon Kempinski Berlin",
        auto: "Mercedes-AMG GT"
    },
    //Rio
    {
        id: 25,
        destino: "Rio de Janeiro",
        pais: "Brasil",
        tipo: "Económico",
        precio: 650,
        hotel: "Ibis Budget Copacabana RJ",
        auto: "Sin auto"
    },
    {
        id: 26,
        destino: "Rio de Janeiro",
        pais: "Brasil",
        tipo: "Intermedio",
        precio: 1200,
        hotel: "Novotel Rio de Janeiro",
        auto: "Jeep Compass"
    },
    {
        id: 27,
        destino: "Rio de Janeiro",
        pais: "Brasil",
        tipo: "All Inclusive",
        precio: 3500,
        hotel: "Copacabana Palace",
        auto: "Toyota Supra MK4"
    },
    //Miami
    {
        id: 28,
        destino: "Miami",
        pais: "Estados Unidos",
        tipo: "Económico",
        precio: 900,
        hotel: "Holiday Inn Miami Beach-Oceanfront",
        auto: "Sin auto"
    },
    {
        id: 29,
        destino: "Miami",
        pais: "Estados Unidos",
        tipo: "Intermedio",
        precio: 1800,
        hotel: "Hilton Miami Downtown",
        auto: "Ford Mustang"
    },
    {
        id: 30,
        destino: "Miami",
        pais: "Estados Unidos",
        tipo: "All Inclusive",
        precio: 4800,
        hotel: "Faena Miami Beach",
        auto: "Lamborghini Huracán"
    },
    //Tokyo
    {
        id: 31,
        destino: "Tokyo",
        pais: "Japón",
        tipo: "Económico",
        precio: 1000,
        hotel: "APA Hotel Shinjuku",
        auto: "Sin auto"
    },
    {
        id: 32,
        destino: "Tokyo",
        pais: "Japón",
        tipo: "Intermedio",
        precio: 1800,
        hotel: "Hotel Metropolitan Tokyo",
        auto: "Toyota Crown"
    },
    {
        id: 33,
        destino: "Tokyo",
        pais: "Japón", 
        tipo: "All Inclusive",
        precio: 5000,
        hotel: "The Ritz-Carlton, Tokyo",
        auto: "Mazda RX-7"
    },
    //Moscú
    {
        id: 34,
        destino: "Moscú",
        pais: "Rusia",
        tipo: "Económico",
        precio: 800,
        hotel: "Ibis Moscow Kievskaya",
        auto: "Sin auto"
    },
    {
        id: 35,
        destino: "Moscú",
        pais: "Rusia", 
        tipo: "Intermedio",
        precio: 1500,
        hotel: "Novotel Moscow City",
        auto: "Toyota Camry"
    },
    {
        id: 36,
        destino: "Moscú",
        pais: "Rusia",
        tipo: "All Inclusive",
        precio: 4000,
        hotel: "The St. Regis Moscow Nikolskaya",
        auto: "Mercedes-AMG GT"
    }
]
const contenedor = document.getElementById("contenedorPaquetes");
const inputBusqueda = document.getElementById("busqueda");
const carritoElemento = document.getElementById("carrito");
const productosCarrito = document.getElementById("productosCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const cantidadCarrito = document.getElementById("cantidadCarrito");

//Carrito acá

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//Mostramos los paquetes acá

function mostrarPaquetes(lista){
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <p class="sin-resultados">
                No encontramos ese destino.
            </p>
        `;
        return;
    }

    lista.forEach(paquete => {
        const card = document.createElement("article");
        card.classList.add("card");
        card.innerHTML = `
        
            <h3>${paquete.destino}</h3>
            <p class="tipo">${paquete.tipo}</p>
            <p>
                ${paquete.pais}
            </p>
            <p>
                ${paquete.hotel}
            </p>
            <p>
                ${paquete.auto}
            </p>
            <p>
                7 Días
            </p>
            ${
                paquete.tipo === "ALL Inclusive"
                ?
                `
                <p>Guía privada</p>
                <p>Buffet Incluido</p>
                <p>Barra Libre 24 horas</p>
                `
                :
                ""
            } 
            <div class="precio">
                USD ${paquete.precio}
            </div>

            <button 
                class="btn-agregar"
                onClick="agregarAlCarrito(${paquete.id})"
            >
                Agregar al carrito
            </button>
        `;
        contenedor.appendChild(card);
    });
}
//Buscador
inputBusqueda.addEventListener("input", () =>{
    const texto = inputBusqueda.value
    .toLowerCase()
    .trim();

    const resultados = paquetes.filter(paquete =>
        paquete.destino
            .toLowerCase()
            .includes(texto)
    );
    mostrarPaquetes(resultados);
});

function agregarAlCarrito(id) {
    const paquete = paquete.find(
        paquete => paquete.id === id
    );

    const productoExistente = carrito.find(
        producto => producto.id === id
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...paquete,
            cantidad: 1
        });
    }
    guardarCarrito();
    mostrarCarrito();
}
//guardamos en localStorage
function guardarCarrito() {
    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}

//mostramos el carrito
function mostrarCarrito() {
    productosCarrito.innerHTML = "";

    if (carrito.length === 0) {
        productosCarrito.innerHTML = `
            <p>
                Tu carrito está vacío.
            </p>
        `;
    }
    let total = 0;
    let cantidad = 0;
    
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        cantidad += producto.cantidad;
        const div = document.createElement("div");

        div.classList.add("producto-carrito");
        div.innerHTML = `
            <h4>
                ${producto.destino}
            </h4>
            <p>
                ${producto.tipo}
            </p>
            <p>
                USD${producto.precio}
            </p>
            <div class="controles">
                <button
                    onClick="disminuirCantidad(${producto.id})
                    >-
                </button>
                <span>
                    ${producto.cantidad}
                </span>
                <button
                    onClick="aumentarCantidad(${producto.id})"
                    >+
                </button>
            </div>
            <button
                class="eliminar"
                onClick="eliminarDelCarrito${producto.id})"
                >Eliminar
            </button>
        `;
        productosCarrito.appendChild(div);
    });
    totalCarrito.textContent = total;
    cantidadCarrito.textContent = cantidad;
}
//aumentar cantidad de productos
function aumentarCantidad(id) {
    const producto = carrito.find(
        producto => producto.id === id
    );

    producto.cantidad++;
    guardarCarrito();
    mostrarCarrito();
}

//disminuir cantidad de productos
function disminuirCantidad(id){
    const producto = carrito.find(
        producto => producto.id === id
    );

    producto.cantidad--;

    if(producto.cantidad <= 0) {
        carrito = carrito.filter(
            producto => producto.id !== id
        );
    }
    guardarCarrito();
    mostrarCarrito();
}
//Eliminar productos del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(
        producto => producto.id !== id
    );
    guardarCarrito();
    mostrarCarrito();
}
//vaciar carrito
document.getElementById("vaciarCarrito").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});
//abrir carrito
document.getElementById("btnCarrito").addEventListener("click", () => {
    carritoElemento.classList.add("abierto");
});
//cerrar carrito
document.getElementById("cerrarCarrito").addEventListener("click", () =>{
    carritoElemento.classList.remove("aierto");
});
//inicio
//acá mostramos todos los paquetes disponibles en la página xd (no quiero programar más)
mostrarPaquetes(paquetes);
mostrarCarrito();