function initMap() {
    const empresaCoords = [28.1329, -15.4311]; // Las Palmas
    const map = L.map('map').setView(empresaCoords, 14);

    // OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Icono personalizado (pin azul con círculo interior transparente)
    const empresaIcon = L.divIcon({
        html: `
        <svg width="35" height="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <!-- Marcador principal -->
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4200f7"/>
          <!-- Punto interior transparente -->
          <circle cx="12" cy="9" r="2.5" fill="transparent"/>
        </svg>
        `,
        className: "",          
        iconSize: [35, 45],    
        iconAnchor: [17, 45],  
        popupAnchor: [0, -40]  
    });

    // Marcador fijo de la empresa
    L.marker(empresaCoords, { icon: empresaIcon }).addTo(map)
        .bindPopup("<b>THE ZENSIVE</b><br>Diseño gráfico y branding creativo")
        .openPopup();

    let control = null;
    const form = document.getElementById("form-direccion");
    const input = document.getElementById("direccion");
    const messageDiv = document.getElementById("map-message");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const origen = input.value.trim();

        if (!origen) {
            messageDiv.textContent = "Por favor, ingresa tu dirección.";
            return;
        }
        messageDiv.textContent = "";

        // Geocodificación con Nominatim
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origen)}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latlngOrigen = [parseFloat(data[0].lat), parseFloat(data[0].lon)];

                    if (control) map.removeControl(control);

                    // Crear ruta
                    control = L.Routing.control({
                        waypoints: [
                            L.latLng(latlngOrigen[0], latlngOrigen[1]),
                            L.latLng(empresaCoords[0], empresaCoords[1])
                        ],
                        routeWhileDragging: false,
                        show: true,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: true,
                        lineOptions: { styles: [{ color: '#4200f7', weight: 5 }] },
                        createMarker: function(i, wp, nWps) {
                            // Origen y destino usan icono naranja
                            if (i === 0 || i === nWps - 1) {
                                return L.marker(wp.latLng, { 
                                    icon: L.divIcon({
                                        html: `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                 <circle cx="12" cy="12" r="6" fill="#ff4633"/>
                                               </svg>`,
                                        className: "",
                                        iconSize: [20, 20],
                                        iconAnchor: [10, 10]
                                    }) 
                                });
                            }
                            return L.marker(wp.latLng);
                        }
                    }).addTo(map);

                    // Asegurar scroll en los pasos de la ruta
                    const instructionsContainer = control.getContainer().querySelector('.leaflet-routing-instructions');
                    if (instructionsContainer) {
                        instructionsContainer.style.maxHeight = '200px';  // altura máxima
                        instructionsContainer.style.overflowY = 'auto';   // habilitar scroll vertical
                        instructionsContainer.style.paddingRight = '6px'; // espacio para scrollbar
                    }

                } else {
                    messageDiv.textContent = "No se pudo encontrar la dirección.";
                }
            })
            .catch(err => {
                console.error(err);
                messageDiv.textContent = "Error al calcular la ruta.";
            });
    });
}

// Inicializar mapa al cargar
window.addEventListener('DOMContentLoaded', initMap);

// Cursor personalizado
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
