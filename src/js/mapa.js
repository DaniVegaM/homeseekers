(function() {
    const lat = document.querySelector('#lat').value || 19.4292914;
    const lng = document.querySelector('#lng').value || -99.1414466;
    const mapa = L.map('mapa').setView([lat, lng ], 12);
    let marker;

    //Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Colocando pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    //Detectar movimiento del pin y leer lat y long
    marker.on('moveend', function(evt){
        marker = evt.target;

        
        const posicion = marker.getLatLng();
        // console.log(posicion)

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
    
        //Obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 12).run(function(error, resultado){
            // console.log(resultado);

            marker.bindPopup(resultado.address.LongLabel)

            //Llenar los campos
            document.querySelector(".calle").textContent = resultado?.address?.Address ?? '';
            document.querySelector("#calle").value = resultado?.address?.Address ?? '';
            document.querySelector("#lat").value = resultado?.latlng?.lat ?? '';
            document.querySelector("#lng").value = resultado?.latlng?.lng ?? '';
        });
    });

})()