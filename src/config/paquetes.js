const destinos = [
    {
        "slug": "ibiza",
        "destino": "Ibiza",
        "pais": "España",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-IBI-VUE-ECO",
            "DEMO-IBI-VUE-PRE",
            "DEMO-IBI-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-IBI-HOS-ECO",
            "DEMO-IBI-HOS-MED",
            "DEMO-IBI-HOS-ALT"
        ],
        "autos": [
            "DEMO-IBI-AUT-MED",
            "DEMO-IBI-AUT-ALT"
        ]
    },
    {
        "slug": "londres",
        "destino": "Londres",
        "pais": "Inglaterra",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-LON-VUE-ECO",
            "DEMO-LON-VUE-PRE",
            "DEMO-LON-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-LON-HOS-IBIS",
            "DEMO-LON-HOS-NOV",
            "DEMO-LON-HOS-SAV"
        ],
        "autos": [
            "DEMO-LON-AUT-BMW",
            "DEMO-LON-AUT-BEN"
        ]
    },
    {
        "slug": "paris",
        "destino": "París",
        "pais": "Francia",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-PAR-VUE-ECO",
            "DEMO-PAR-VUE-PRE",
            "DEMO-PAR-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-PAR-HOS-ECO",
            "DEMO-PAR-HOS-MED",
            "DEMO-PAR-HOS-ALT"
        ],
        "autos": [
            "DEMO-PAR-AUT-MED",
            "DEMO-PAR-AUT-ALT"
        ]
    },
    {
        "slug": "buenos-aires",
        "destino": "Buenos Aires",
        "pais": "Argentina",
        "origen": "Córdoba",
        "vuelos": [
            "DEMO-BUE-VUE-ECO",
            "DEMO-BUE-VUE-PRE",
            "DEMO-BUE-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-BUE-HOS-ECO",
            "DEMO-BUE-HOS-MED",
            "DEMO-BUE-HOS-ALT"
        ],
        "autos": [
            "DEMO-BUE-AUT-MED",
            "DEMO-BUE-AUT-ALT"
        ]
    },
    {
        "slug": "estambul",
        "destino": "Estambul",
        "pais": "Turquía",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-IST-VUE-ECO",
            "DEMO-IST-VUE-PRE",
            "DEMO-IST-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-IST-HOS-ECO",
            "DEMO-IST-HOS-MED",
            "DEMO-IST-HOS-ALT"
        ],
        "autos": [
            "DEMO-IST-AUT-MED",
            "DEMO-IST-AUT-ALT"
        ]
    },
    {
        "slug": "roma",
        "destino": "Roma",
        "pais": "Italia",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-ROM-VUE-ECO",
            "DEMO-ROM-VUE-PRE",
            "DEMO-ROM-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-ROM-HOS-ECO",
            "DEMO-ROM-HOS-MED",
            "DEMO-ROM-HOS-ALT"
        ],
        "autos": [
            "DEMO-ROM-AUT-MED",
            "DEMO-ROM-AUT-ALT"
        ]
    },
    {
        "slug": "dubai",
        "destino": "Dubái",
        "pais": "Emiratos Árabes Unidos",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-DXB-VUE-ECO",
            "DEMO-DXB-VUE-PRE",
            "DEMO-DXB-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-DXB-HOS-ECO",
            "DEMO-DXB-HOS-MED",
            "DEMO-DXB-HOS-ALT"
        ],
        "autos": [
            "DEMO-DXB-AUT-MED",
            "DEMO-DXB-AUT-ALT"
        ]
    },
    {
        "slug": "berlin",
        "destino": "Berlín",
        "pais": "Alemania",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-BER-VUE-ECO",
            "DEMO-BER-VUE-PRE",
            "DEMO-BER-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-BER-HOS-ECO",
            "DEMO-BER-HOS-MED",
            "DEMO-BER-HOS-ALT"
        ],
        "autos": [
            "DEMO-BER-AUT-MED",
            "DEMO-BER-AUT-ALT"
        ]
    },
    {
        "slug": "rio-de-janeiro",
        "destino": "Río de Janeiro",
        "pais": "Brasil",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-RIO-VUE-ECO",
            "DEMO-RIO-VUE-PRE",
            "DEMO-RIO-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-RIO-HOS-ECO",
            "DEMO-RIO-HOS-MED",
            "DEMO-RIO-HOS-ALT"
        ],
        "autos": [
            "DEMO-RIO-AUT-MED",
            "DEMO-RIO-AUT-ALT"
        ]
    },
    {
        "slug": "miami",
        "destino": "Miami",
        "pais": "Estados Unidos",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-MIA-VUE-ECO",
            "DEMO-MIA-VUE-PRE",
            "DEMO-MIA-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-MIA-HOS-ECO",
            "DEMO-MIA-HOS-MED",
            "DEMO-MIA-HOS-ALT"
        ],
        "autos": [
            "DEMO-MIA-AUT-MED",
            "DEMO-MIA-AUT-ALT"
        ]
    },
    {
        "slug": "tokyo",
        "destino": "Tokyo",
        "pais": "Japón",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-TYO-VUE-ECO",
            "DEMO-TYO-VUE-PRE",
            "DEMO-TYO-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-TYO-HOS-ECO",
            "DEMO-TYO-HOS-MED",
            "DEMO-TYO-HOS-ALT"
        ],
        "autos": [
            "DEMO-TYO-AUT-MED",
            "DEMO-TYO-AUT-ALT"
        ]
    },
    {
        "slug": "moscu",
        "destino": "Moscú",
        "pais": "Rusia",
        "origen": "Buenos Aires",
        "vuelos": [
            "DEMO-MOW-VUE-ECO",
            "DEMO-MOW-VUE-PRE",
            "DEMO-MOW-VUE-EJE"
        ],
        "hospedajes": [
            "DEMO-MOW-HOS-ECO",
            "DEMO-MOW-HOS-MED",
            "DEMO-MOW-HOS-ALT"
        ],
        "autos": [
            "DEMO-MOW-AUT-MED",
            "DEMO-MOW-AUT-ALT"
        ]
    }
];

const niveles = [
    { sufijo: "economico", tipo: "Económico" },
    { sufijo: "intermedio", tipo: "Intermedio" },
    { sufijo: "all-inclusive", tipo: "All Inclusive" }
];

module.exports = destinos.flatMap((destino) =>
    niveles.map((nivel, indice) => ({
        id: `${destino.slug}-${nivel.sufijo}`,
        tipo: nivel.tipo,
        destino: destino.destino,
        pais: destino.pais,
        origen: destino.origen,
        fechaEntrada: "2026-11-20",
        fechaSalida: "2026-11-26",
        diasEstadia: 7,
        noches: 6,
        permiteSinAuto: true,
        demostracion: true,
        opciones: {
            vuelos: [...destino.vuelos],
            hospedajes: [...destino.hospedajes],
            autos: [...destino.autos]
        },
        seleccionInicial: {
            vuelo: destino.vuelos[indice],
            hospedaje: destino.hospedajes[indice],
            auto: indice === 0 ? null : destino.autos[indice - 1]
        }
    }))
);