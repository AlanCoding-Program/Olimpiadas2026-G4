const informacionDestinos = {
    tokyo: {
        titulo: "Tokyo",
        imagen: "img/tokyo.png",
        bandera: "flag:jp-4x3",
        descripcion: "Tokio es la capital de Japón, una enorme ciudad que combina tecnología, tradición, cultura y una gastronomía reconocida mundialmente",
        datos: [
            "País: Japón",
            "Famoso por su tecnología",
            "Gastronomia: Sushi, Ramen, Tempura y Yakitori.",
            "Atracción: Torre de Tokio, cruce de Shibuya y templo Senso-Ji",
            "Mejor época: Primavera y Otoño"
        ]
    },
    dubai: {
        titulo: "Dubai",
        imagen: "img/dubai.png",
        bandera: "flag:ae-4x3",
        descripcion: "Dubai es una ciudad de los Emiratos Árabes Unidos conocida por sus modernos rascacielos, lujosos centros comerciales, playas y grandes obras arquitectónicas.",
        datos: [
            "Gastronomía: Shawarma, hummus, falafel, machboos y dulces árabes.",
            "Atracción: Burj Khalifa, Palm Jumeirah y Dubai Mall.",
            "Mejor época: De noviembre a marzo."
        ]
    },
    roma: {
        titulo: "Roma",
        imagen: "img/roma.png",
        bandera: "flag:it-4x3",
        descripcion: "Roma es la capital de Italia y una de las ciudades con mayor importancia histórica del mundo, con monumentos que reflejan miles de años de historia.",
        datos: [
            "Gastronomía: Pizza romana, pasta, carbonara, gelato y tiramisú.",
            "Atracción: Coliseo, Fontana di Trevi y Ciudad del Vaticano",
            "Mejor época: Primavera a Otoño"
        ]
    },
    rioDeJaneiro: {
        titulo: "Río de Janeiro",
        imagen: "img/rio-de-janeiro.jpg",
        bandera: "flag:br-4x3",
        descripcion: "Río de Janeiro es una de las ciudades más famosas de Brasil, reconocida por sus playas, montañas, paisajes y el carnaval.",
        datos: [
            "Gastronomía: Feijoada, pão de queijo, churrasco y açaí.",
            "Atracción: Cristo Redentor, Pan de Azúcar y playa de Copacabana.",
            "Mejor época: De diciembre a marzo."
        ]
    },
    moscu: {
        titulo: "Moscú",
        imagen: "img/moscu.jpg",
        bandera: "flag:ru-4x3",
        descripcion: "Moscú es la capital de Rusia y una ciudad con una gran riqueza histórica y cultural, famosa por sus monumentos y arquitectura.",
        datos: [
            "Gastronomía: Borsch, pelmeni, blini y ensalada Olivier.",
            "Atracción: Plaza Roja, Kremlin y Catedral de San Basilio.",
            "Mejor época: De mayo a septiembre."
        ]
    },
    berlin: {
        titulo: "Berlín",
        imagen: "img/berlin.jpg",
        bandera: "flag:de-4x3",
        descripcion: "Berlín es la capital de Alemania y una ciudad conocida por su historia, arte, cultura y su importante papel en la historia europea.",
        datos: [
            "Gastronomía: Currywurst, schnitzel, pretzels y döner kebab.",
            "Atracción: Puerta de Brandeburgo, Muro de Berlín y Reichstag.",
            "Mejor época: De mayo a septiembre."
        ]
    },

    londres: {
        titulo: "Londres",
        imagen: "img/londres.jpg",
        bandera: "flag:gb-eng-4x3",
        descripcion: "Londres es la capital del Reino Unido y una de las ciudades más importantes del mundo, famosa por su historia, cultura y arquitectura.",
        datos: [
            "Gastronomía: Fish and chips, pie, roast beef y afternoon tea.",
            "Atracción: Big Ben, Tower Bridge y Palacio de Buckingham.",
            "Mejor época: De mayo a septiembre."
        ]
    },
    buenosaires: {
        titulo: "Buenos Aires",
        imagen: "img/buenosaires.jpg",
        bandera: "flag:ar-4x3",
        descripcion: "Buenos Aires es la capital de Argentina, reconocida por su arquitectura, el tango, su cultura y su variada gastronomía.",
        datos: [
            "Gastronomía: Asado, empanadas, milanesa y alfajores.",
            "Atracción: Obelisco, Caminito y Teatro Colón.",
            "Mejor época: Primavera y otoño."
        ]
    },
    paris: {
        titulo: "París",
        imagen: "img/paris.jpg",
        bandera: "flag:cp-4x3",
        descripcion: "París es la capital de Francia y una de las ciudades más visitadas del mundo, famosa por su arte, arquitectura, historia y romanticismo.",
        datos: [
            "Gastronomía: Croissants, baguettes, quesos y crêpes.",
            "Atracción: Torre Eiffel, Museo del Louvre y Arco del Triunfo.",
            "Mejor época: Primavera y otoño."
        ]
    },
    ibiza: {
        titulo: "Ibiza",
        imagen: "img/ibiza.jpg",
        bandera: "flag:es-4x3",
        descripcion: "Ibiza es una isla española del Mediterráneo conocida por sus playas, aguas cristalinas, paisajes y su famosa vida nocturna.",
        datos: [
            "Gastronomía: Bullit de peix, paella, sobrasada y pescados frescos.",
            "Atracción: Cala Comte, Dalt Vila y sus playas.",
            "Mejor época: De mayo a octubre."
        ]
    },
    estambul: {
        titulo: "Estambul",
        imagen: "img/turquia/estambul1.jpg",
        bandera: "flag:tr-4x3",
        descripcion: "Estambul es una ciudad de Turquía situada entre Europa y Asia, famosa por su historia, sus mezquitas, mercados y su mezcla de culturas.",
        datos: [
            "Gastronomía: Kebab, baklava, lokum y meze.",
            "Atracción: Santa Sofía, Mezquita Azul y Gran Bazar.",
            "Mejor época: Primavera y otoño."
        ]
    },
        miami: {
        titulo: "Miami",
        imagen: "img/miami.jpg",
        bandera: "flag:us-4x3",
        descripcion: "Miami es una ciudad de Estados Unidos conocida por sus playas, su clima cálido, su vida nocturna y su gran influencia latinoamericana.",
        datos: [
            "Gastronomía: Cocina cubana, mariscos, hamburguesas y platos latinoamericanos.",
            "Atracción: South Beach, Ocean Drive y Little Havana.",
            "Mejor época: De noviembre a abril."
        ]
    }
}

function mostrarDestino(destino){
    const info = informacionDestinos[destino];
    if (!info) {
        console.error("No existe información para:", destino);
        return;
    }
    document.getElementById("tituloDestino").innerHTML = `
        <iconify-icon icon="${info.bandera}"></iconify>
        ${info.titulo}
    `;
    document.getElementById("imagenDestino").src = info.imagen;
    document.getElementById("imagenDestino").alt = info.titulo;
    document.getElementById("descripcionDestino").textContent = info.descripcion;

    const lista = document.getElementById("datosDestino")
    lista.innerHTML = "";
    
    info.datos.forEach(dato => {
        const li = document.createElement("li");
        li.textContent = dato;
        lista.appendChild(li);
    });

    document.getElementById("modalDestino").classList.add("activo");
}

function cerrarDestino(){
    document.getElementById("modalDestino").classList.remove("activo")
}