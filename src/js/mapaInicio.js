(function(){
    const lat =  19.4292914;
    const lng = -99.1414466;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
})()