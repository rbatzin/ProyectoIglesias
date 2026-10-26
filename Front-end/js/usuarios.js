// Verificamos que existe el token antes de ingresar
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html'; // Ruta actualizada

const formUsuario = document.getElementById('formUsuario');
const tablaUsuarios = document.getElementById('tablaUsuarios');
let idEdicion = null;

async function cargarUsuarios() {
    try {
        const response = await fetch('https://proyectoiglesias.onrender.com/api/usuario', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            const usuarios = await response.json();
            tablaUsuarios.innerHTML = '';
            usuarios.forEach(user => {
                tablaUsuarios.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.login}</td>
                        <td>${user.grupo}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="cargarDatosUsuario(${user.id}, '${user.login}', ${user.grupo})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${user.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) { console.error("Error", error); }
}

window.cargarDatosUsuario = (id, login, grupo) => {
    document.getElementById('login').value = login;
    document.getElementById('grupo').value = grupo;
    document.getElementById('password').removeAttribute('required');
    document.getElementById('password').placeholder = "En blanco para mantener actual";
    
    idEdicion = id;
    document.getElementById('tituloFormulario').innerText = "Editar Usuario";
    document.getElementById('btnGuardar').innerText = "Actualizar Usuario";
    document.getElementById('btnGuardar').classList.replace('btn-success', 'btn-warning');
};

window.eliminarUsuario = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
        const response = await fetch(`https://proyectoiglesias.onrender.com/api/usuario/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            cargarUsuarios();
            alert('Usuario eliminado');
        }
    } catch (error) { console.error("Error", error); }
};

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        login: document.getElementById('login').value,
        grupo: document.getElementById('grupo').value
    };

    const pass = document.getElementById('password').value;
    if (pass) datos.password = pass;

    const metodo = idEdicion ? 'PUT' : 'POST';
    const url = idEdicion ? `https://proyectoiglesias.onrender.com/api/usuario/${idEdicion}` : 'https://proyectoiglesias.onrender.com/api/usuario';

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
            formUsuario.reset();
            idEdicion = null;
            document.getElementById('password').setAttribute('required', 'true');
            document.getElementById('password').placeholder = "";
            document.getElementById('tituloFormulario').innerText = "Registrar Nuevo Usuario";
            document.getElementById('btnGuardar').innerText = "Guardar Usuario";
            document.getElementById('btnGuardar').classList.replace('btn-warning', 'btn-success');
            cargarUsuarios();
            alert(idEdicion ? 'Usuario actualizado' : 'Usuario creado');
        } else { alert('Error al procesar el usuario'); }
    } catch (error) { console.error("Error", error); }
});

cargarUsuarios();