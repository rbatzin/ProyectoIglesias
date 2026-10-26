const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const formPermiso = document.getElementById('formPermiso');
const tablaPermisos = document.getElementById('tablaPermisos');
let idEdicion = null;

async function cargarPermisos() {
    try {
        const response = await fetch('https://proyectoiglesias.onrender.com/api/permiso', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            const permisos = await response.json();
            tablaPermisos.innerHTML = '';
            permisos.forEach(permiso => {
                tablaPermisos.innerHTML += `
                    <tr>
                        <td>${permiso.id}</td>
                        <td>${permiso.nombre}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="cargarDatosPermiso(${permiso.id}, '${permiso.nombre}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarPermiso(${permiso.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) { console.error("Error", error); }
}

window.cargarDatosPermiso = (id, nombre) => {
    document.getElementById('nombrePermiso').value = nombre;
    idEdicion = id;
    document.getElementById('tituloFormulario').innerText = "Editar Permiso";
    document.getElementById('btnGuardar').innerText = "Actualizar Permiso";
    document.getElementById('btnGuardar').classList.replace('btn-success', 'btn-warning');
};

window.eliminarPermiso = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este permiso?')) return;
    try {
        const response = await fetch(`https://proyectoiglesias.onrender.com/api/permisos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            cargarPermisos();
            alert('Permiso eliminado');
        }
    } catch (error) { console.error("Error", error); }
};

formPermiso.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = { nombre: document.getElementById('nombrePermiso').value };
    const metodo = idEdicion ? 'PUT' : 'POST';
    const url = idEdicion ? `https://proyectoiglesias.onrender.com/api/permisos/${idEdicion}` : 'https://proyectoiglesias.onrender.com/api/permisos';

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            formPermiso.reset();
            idEdicion = null;
            document.getElementById('tituloFormulario').innerText = "Crear Nuevo Permiso";
            document.getElementById('btnGuardar').innerText = "Guardar Permiso";
            document.getElementById('btnGuardar').classList.replace('btn-warning', 'btn-success');
            cargarPermisos();
            alert(idEdicion ? 'Permiso actualizado' : 'Permiso creado');
        } else { alert('Error al guardar permiso'); }
    } catch (error) { console.error("Error", error); }
});

cargarPermisos();