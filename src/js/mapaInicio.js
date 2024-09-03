(function(){
    const lat =  19.4292914;
    const lng = -99.1414466;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12);

    let markers = new L.FeatureGroup().addTo(mapa);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/properties';
            const respuesta = await fetch(url); //Fetch es una forma de consumir API
            const propiedades = await respuesta.json();

            mostrarPropiedades(propiedades);
        } catch (error) {
            console.log(error);
        }
    }

    const mostrarPropiedades = propiedades => {
        propiedades.forEach(propiedad => {
            //Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            }).addTo(mapa).bindPopup(propiedad.titulo + '<br>' + propiedad.calle)

            markers.addLayer(marker) //Para que mas adelante se puedan realizar filtros
        }
        )
    }

    obtenerPropiedades();
})()