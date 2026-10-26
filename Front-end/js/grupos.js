const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const formGrupo = document.getElementById('formGrupo');
const tablaGrupos = document.getElementById('tablaGrupos');
let idEdicion = null;

async function cargarGrupos() {
    try {
        const response = await fetch('http://localhost:8010/api/grupo', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            const grupos = await response.json();
            tablaGrupos.innerHTML = '';
            grupos.forEach(grupo => {
                tablaGrupos.innerHTML += `
                    <tr>
                        <td>${grupo.id}</td>
                        <td>${grupo.nombre}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="cargarDatosGrupo(${grupo.id}, '${grupo.nombre}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarGrupo(${grupo.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) { console.error("Error", error); }
}

window.cargarDatosGrupo = (id, nombre) => {
    document.getElementById('nombreGrupo').value = nombre;
    idEdicion = id;
    document.getElementById('tituloFormulario').innerText = "Editar Grupo";
    document.getElementById('btnGuardar').innerText = "Actualizar Grupo";
    document.getElementById('btnGuardar').classList.replace('btn-success', 'btn-warning');
};

window.eliminarGrupo = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este grupo?')) return;
    try {
        const response = await fetch(`http://localhost:8010/api/grupos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            cargarGrupos();
            alert('Grupo eliminado');
        }
    } catch (error) { console.error("Error", error); }
};

formGrupo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = { nombre: document.getElementById('nombreGrupo').value };
    const metodo = idEdicion ? 'PUT' : 'POST';
    const url = idEdicion ? `http://localhost:8010/api/grupos/${idEdicion}` : 'http://localhost:8010/api/grupos';

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
            formGrupo.reset();
            idEdicion = null;
            document.getElementById('tituloFormulario').innerText = "Crear Nuevo Grupo";
            document.getElementById('btnGuardar').innerText = "Guardar Grupo";
            document.getElementById('btnGuardar').classList.replace('btn-warning', 'btn-success');
            cargarGrupos();
            alert(idEdicion ? 'Grupo actualizado' : 'Grupo creado');
        } else { alert('Error al guardar grupo'); }
    } catch (error) { console.error("Error", error); }
});

cargarGrupos();