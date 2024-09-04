(function(){
    const lat =  19.4292914;
    const lng = -99.1414466;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 11);

    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = [];
    
    //Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');
    const cleanFiltersButton = document.querySelector('#clean-filters');


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades();
    })
    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades();
    })
    cleanFiltersButton.addEventListener('click', e => {
        mostrarPropiedades(propiedades);
        categoriasSelect.value= "999"
        preciosSelect.value= "999"
    })

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/properties';
            const respuesta = await fetch(url); //Fetch es una forma de consumir API
            propiedades = await respuesta.json();

            mostrarPropiedades(propiedades);
        } catch (error) {
            console.log(error);
        }
    }

    const mostrarPropiedades = propiedades => {

        //Limpiar los markers previos
        markers.clearLayers();

        propiedades.forEach(propiedad => {
            //Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            }).addTo(mapa).bindPopup(`
                <p class="text-indigo-600 font-bold uppercase">${propiedad.categoria.nombre}</p>    
                <h1 class="text-center text-xl font-extrabold mb-2">${propiedad?.titulo}</h1>
                <img class="min-w-64" src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad: ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/property/${propiedad.id}" class="hover:bg-indigo-800 transition-all bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `)

            markers.addLayer(marker) //Para que mas adelante se puedan realizar filtros
        }
        )
    }

    const filtrarPropiedades = () =>{
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio);
        mostrarPropiedades(resultado)
    }

    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;
    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad;

    obtenerPropiedades();
})()