// 1. Manejo de Sesión y Permisos
const token = localStorage.getItem('token');
const navButtonsContainer = document.querySelector('.navbar .d-flex.gap-2');
const explorarHeader = document.querySelector('.d-flex.flex-wrap.justify-content-between.align-items-end.gap-3.mb-3');

if (token) {
    if (navButtonsContainer) {
        navButtonsContainer.innerHTML = `
            <a href="dashboard.html" class="btn btn-outline-light btn-sm">Panel de Control</a>
            <button id="btnCerrarSesionMapa" class="btn btn-danger btn-sm fw-bold">Cerrar Sesión</button>
        `;
        document.getElementById('btnCerrarSesionMapa').addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.reload(); 
        });
    }

    fetch('https://proyectoiglesias.onrender.com/api/mis-permisos', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(permisos => {
        const permisosLimpios = permisos.map(p => (p.nombre || p).toString().trim());
        if (permisosLimpios.includes('frm_iglesias') && explorarHeader) {
            explorarHeader.innerHTML += `<button class="btn btn-dark" id="newChurchBtn" data-bs-toggle="modal" data-bs-target="#churchModal">＋ Registrar iglesia</button>`;
        }
    })
    .catch(err => console.error('Error al verificar permisos:', err));
}

// 2. Inicialización del Mapa (Leaflet) centrado en Antigua Guatemala
const map = L.map('map').setView([14.5586, -90.7295], 14);

const btnSeleccionarPunto = document.getElementById('btnSeleccionarPunto');
const modalElement = document.getElementById('churchModal');
let eventoClicMapa;

if (btnSeleccionarPunto) {
    btnSeleccionarPunto.addEventListener('click', () => {
        // 1. Ocultar el formulario temporalmente
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        // 2. Cambiar el cursor para indicarle al usuario que seleccione un punto
        document.getElementById('map').style.cursor = 'crosshair';
        
        // 3. Definir la acción al hacer clic en el mapa
        eventoClicMapa = function(e) {
            // Capturar las coordenadas generadas por Leaflet (limitadas a 6 decimales)
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);

            // Asignar los valores a los campos del formulario
            document.getElementById('latitud').value = lat;
            document.getElementById('longitud').value = lng;

            // Restaurar el cursor normal y apagar el evento de escucha
            document.getElementById('map').style.cursor = '';
            map.off('click', eventoClicMapa);

            // Volver a abrir el formulario automáticamente
            modalInstance.show();
        };

        // 4. Encender la escucha del clic en el mapa
        map.on('click', eventoClicMapa);
    });
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Función para cargar los datos del Back-end (Pendiente de conectar)
async function cargarDirectorio() {
    const lista = document.getElementById('churchList');
    if(lista) {
        lista.innerHTML = `<div class="empty-state text-muted p-3">Base de datos conectada. Esperando registros...</div>`;
    }
}

const formIglesia = document.getElementById('formIglesia');

if (formIglesia) {
    formIglesia.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores de coordenadas
        const lat = parseFloat(document.getElementById('latitud').value);
        const lon = parseFloat(document.getElementById('longitud').value);

        // 1. Validación de coordenadas exigida en el documento
        if (lat < -90 || lat > 90) {
            return alert('Error: La latitud debe estar entre -90 y 90.');
        }
        if (lon < -180 || lon > 180) {
            return alert('Error: La longitud debe estar entre -180 y 180.');
        }

        // 2. Preparar el objeto con los datos del formulario
        const nuevaIglesia = {
            nombre: document.getElementById('nombreIglesia').value,
            tipo: document.getElementById('tipoIglesia').value,
            descripcion: document.getElementById('descripcionIglesia').value,
            direccion: document.getElementById('direccionIglesia').value,
            departamento: document.getElementById('departamento').value,
            municipio: document.getElementById('municipio').value,
            latitud: lat,
            longitud: lon,
            estado: 'activo' // Agregamos el estado por defecto
        };

        // 3. Enviar los datos al servidor
        try {
            const response = await fetch('https://proyectoiglesias.onrender.com/api/iglesia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(nuevaIglesia)
            });

            if (response.ok) {
                alert('Iglesia registrada correctamente.');
                formIglesia.reset();
                
                // Ocultar el modal automáticamente
                const modal = bootstrap.Modal.getInstance(document.getElementById('churchModal'));
                if (modal) modal.hide();
                
                // Recargar el mapa/lista
                cargarDirectorio();
            } else {
                const data = await response.json();
                alert('Error al guardar: ' + (data.message || 'Revisa tu conexión.'));
            }
        } catch (error) {
            console.error('Error al guardar iglesia:', error);
            alert('Error de conexión con el servidor.');
        }
    });
}

let iglesiasGlobal = []; // Almacena los datos en memoria
const lista = document.getElementById('churchList');
const mapCount = document.getElementById('mapCount'); // Contador del mapa

// Elementos de búsqueda y filtrado
const inputBuscador = document.getElementById('searchInput');
const selectTipo = document.getElementById('typeFilter');
const btnLimpiar = document.getElementById('resetFilters');

// 1. Obtener datos del servidor
async function cargarDirectorio() {
    try {
        const response = await fetch('https://proyectoiglesias.onrender.com/api/iglesia');
        if (response.ok) {
            iglesiasGlobal = await response.json();
            filtrarResultados(); // Llamamos a filtrar en lugar de dibujar directamente
        }
    } catch (error) {
        console.error("Error al cargar iglesias:", error);
        if (lista) lista.innerHTML = `<div class="empty-state text-danger">Error de conexión con el servidor.</div>`;
    }
}

// 2. Dibujar marcadores y lista
function renderizarMapaYLista(datos) {
    if (lista) lista.innerHTML = '';
    
    // Actualizar contador
    if (mapCount) mapCount.textContent = `${datos.length} lugares`;

    // Limpiar marcadores previos del mapa
    map.eachLayer((layer) => {
        if (!!layer.toGeoJSON) map.removeLayer(layer);
    });

    if (datos.length === 0) {
        if (lista) lista.innerHTML = `<div class="empty-state">No se encontraron resultados.</div>`;
        return;
    }

    datos.forEach(iglesia => {
        if (iglesia.estado === 'activo') {
            const marker = L.marker([iglesia.latitud, iglesia.longitud]).addTo(map);
            marker.bindPopup(`
                <div class="text-center">
                    <h6 class="fw-bold mb-1">${iglesia.nombre}</h6>
                    <p class="text-muted small mb-2">${iglesia.tipo}</p>
                    <p class="small mb-2">${iglesia.direccion || iglesia.municipio}</p>
                    <a href="https://www.google.com/maps?q=${iglesia.latitud},${iglesia.longitud}" target="_blank" class="btn btn-sm btn-primary w-100">📍 Abrir en Google Maps</a>
                </div>
            `);

            if (lista) {
                lista.innerHTML += `
                <div class="list-group-item mb-3 p-3 border rounded shadow-sm" style="cursor: pointer; transition: all 0.2s ease;" onclick="map.setView([${iglesia.latitud}, ${iglesia.longitud}], 17)">
                    
                    <!-- Encabezado: Nombre -->
                    <h5 class="fw-bold mb-2 text-dark">${iglesia.nombre}</h5>
                    
                    <!-- Etiquetas: Tipo y Ubicación -->
                    <div class="d-flex align-items-center mb-3">
                        <span class="badge border text-dark bg-light px-2 py-1 me-2">${iglesia.tipo}</span>
                        <small class="text-secondary">📍 ${iglesia.municipio}</small>
                    </div>

                    <!-- Detalles: Agrupados con un margen sutil -->
                    <div class="mb-3 ps-2" style="border-left: 3px solid #e9ecef;">
                        ${iglesia.descripcion ? `<div class="small mb-1"><strong class="text-dark">Descripción:</strong> <span class="text-muted">${iglesia.descripcion}</span></div>` : ''}
                        ${iglesia.direccion ? `<div class="small"><strong class="text-dark">Referencia:</strong> <span class="text-muted">${iglesia.direccion}</span></div>` : ''}
                    </div>

                    <!-- Botón de Acción -->
                    <a href="https://www.google.com/maps?q=${iglesia.latitud},${iglesia.longitud}" 
                    target="_blank" 
                    class="btn btn-sm w-100 py-2 text-white fw-bold mt-1"
                    style="background-color: #1a493b; border-color: #1a493b;"
                    onclick="event.stopPropagation();">
                    🗺️ Abrir en Google Maps
                    </a>
                </div>
                `;
            }
        }
    });
}

// 3. Lógica central de filtrado (Búsqueda + Tipo)
function filtrarResultados() {
    const termino = inputBuscador.value.toLowerCase();
    const tipo = selectTipo.value;

    const resultados = iglesiasGlobal.filter(iglesia => {
        // Filtrar por texto (nombre, municipio, departamento)
        const coincideTexto = iglesia.nombre.toLowerCase().includes(termino) ||
                              iglesia.municipio.toLowerCase().includes(termino) ||
                              iglesia.departamento.toLowerCase().includes(termino);
        
        // Filtrar por tipo (exacto)
        const coincideTipo = tipo === "" || iglesia.tipo === tipo;

        return coincideTexto && coincideTipo;
    });

    renderizarMapaYLista(resultados);
}

// 4. Eventos de los filtros
if (inputBuscador) {
    inputBuscador.addEventListener('input', filtrarResultados);
}

if (selectTipo) {
    selectTipo.addEventListener('change', filtrarResultados);
}

if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
        inputBuscador.value = '';
        selectTipo.value = '';
        filtrarResultados();
    });
}

// Iniciar
cargarDirectorio();