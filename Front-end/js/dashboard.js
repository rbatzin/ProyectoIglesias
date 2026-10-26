const token = localStorage.getItem('token');

// Si no hay token, lo devolvemos al login que ahora está en modulos/
if (!token) window.location.href = 'modulos/login.html';

document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

async function cargarMenuDinamico() {
    const menu = document.getElementById('menu-dinamico');
    menu.innerHTML = ''; 


    try {
        // Petición a tu endpoint de permisos
        const response = await fetch('http://localhost:8010/api/mis-permisos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            const misPermisos = await response.json(); 
            const permisosLimpios = misPermisos.map(p => (p.nombre || p).toString().trim());
            
            
            // Botón de Gestión de Iglesias
            if (permisosLimpios.includes('frm_iglesias')) { 
                menu.innerHTML += `<li class="nav-item"><a class="nav-link fw-bold" href="modulos/gestion_iglesias.html">Gestionar Iglesias</a></li>`;
            }
            // Botón de Usuarios
            if (permisosLimpios.includes('frm_usuarios')) { 
                menu.innerHTML += `<li class="nav-item"><a class="nav-link" href="modulos/usuarios.html">Usuarios</a></li>`;
            }
            // Botón de Grupos
            if (permisosLimpios.includes('frm_grupos')) { 
                menu.innerHTML += `<li class="nav-item"><a class="nav-link" href="modulos/grupos.html">Grupos</a></li>`;
            }
            // Botón de Permisos
            if (permisosLimpios.includes('frm_permisos')) { 
                menu.innerHTML += `<li class="nav-item"><a class="nav-link" href="modulos/permisos.html">Permisos</a></li>`;
            }
        }
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

cargarMenuDinamico();