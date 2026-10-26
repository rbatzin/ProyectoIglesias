let listaIglesiasAdmin = []; // Para buscar rápidamente al editar
const token = localStorage.getItem('token'); // Ajusta según cómo guardes tu token JWT

// 1. Cargar la tabla administrativa
// Variable global para saber si es admin
let esAdminGlobal = false; 

// 1. Cargar la tabla administrativa
async function cargarTablaIglesias() {
    const tbody = document.getElementById('tbodyIglesias');
    
    // Consultamos los permisos antes de dibujar la tabla
    try {
        const resPermisos = await fetch('https://proyectoiglesias.onrender.com/api/mis-permisos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resPermisos.ok) {
            const permisos = await resPermisos.json();
            const permisosLimpios = permisos.map(p => (p.nombre || p).toString().trim());
            esAdminGlobal = permisosLimpios.includes('frm_usuarios'); // Si tiene este permiso, es admin
        }
    } catch (e) {
        console.error("Error al cargar permisos para la tabla:", e);
    }

    try {
        const response = await fetch('https://proyectoiglesias.onrender.com/api/iglesia', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            listaIglesiasAdmin = await response.json();
            tbody.innerHTML = '';
            
            if (listaIglesiasAdmin.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay iglesias registradas.</td></tr>';
                return;
            }

            // Si NO es admin, preparamos la propiedad disabled
            const estadoBotonEliminar = esAdminGlobal ? '' : 'disabled';

            listaIglesiasAdmin.forEach(iglesia => {
                const badgeColor = iglesia.estado === 'activo' ? 'bg-success' : 'bg-warning text-dark';
                
                tbody.innerHTML += `
                    <tr>
                        <td class="fw-bold">${iglesia.nombre}</td>
                        <td>${iglesia.tipo}</td>
                        <td>${iglesia.municipio}</td>
                        <td><span class="badge ${badgeColor}">${iglesia.estado.toUpperCase()}</span></td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalEditar(${iglesia.id})">
                                Editar
                            </button>
                            <!-- Aquí aplicamos el estado de bloqueo dinámico -->
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarIglesia(${iglesia.id})" ${estadoBotonEliminar}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error("Error:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar datos.</td></tr>';
    }
}


// 2. Rellenar y abrir el Modal de edición
window.abrirModalEditar = async function(id) {
    const iglesia = listaIglesiasAdmin.find(i => i.id === id);
    if (!iglesia) return;

    // Rellenar formulario
    document.getElementById('editId').value = iglesia.id;
    document.getElementById('editNombre').value = iglesia.nombre;
    document.getElementById('editTipo').value = iglesia.tipo;
    document.getElementById('editDescripcion').value = iglesia.descripcion || '';
    document.getElementById('editEstado').value = iglesia.estado;
    document.getElementById('editMunicipio').value = iglesia.municipio || '';

    // Validar permisos directamente con el Back-end para desbloquear el Estado
    try {
        const response = await fetch('https://proyectoiglesias.onrender.com/api/mis-permisos', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const permisos = await response.json();
            const permisosLimpios = permisos.map(p => (p.nombre || p).toString().trim());
            
            // Si el usuario tiene acceso a 'frm_usuarios' o 'frm_permisos', es Administrador
            const esAdmin = permisosLimpios.includes('frm_usuarios');
            document.getElementById('editEstado').disabled = !esAdmin;
        }
    } catch (error) {
        console.error("Error al verificar permisos:", error);
        document.getElementById('editEstado').disabled = true; // Bloquear por defecto si hay error
    }

    // Abrir Modal de Bootstrap
    const modalInstance = new bootstrap.Modal(document.getElementById('modalEditarIglesia'));
    modalInstance.show();
};

// 3. Guardar cambios (Método PUT)
document.getElementById('formEditarIglesia').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que recargue la página
    
    const id = document.getElementById('editId').value;
    const datosActualizados = {
        nombre: document.getElementById('editNombre').value,
        tipo: document.getElementById('editTipo').value,
        descripcion: document.getElementById('editDescripcion').value,
        estado: document.getElementById('editEstado').value,
        municipio: document.getElementById('editMunicipio').value
    };

    try {
        const response = await fetch(`https://proyectoiglesias.onrender.com/api/iglesia/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosActualizados)
        });

        if (response.ok) {
            // Ocultar modal
            const modalElement = document.getElementById('modalEditarIglesia');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            
            // Recargar tabla para ver los cambios
            cargarTablaIglesias();
            alert("Registro actualizado correctamente");
        } else {
            alert("Error al actualizar el registro");
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// 4. Eliminar registro (Método DELETE)
window.eliminarIglesia = async function(id) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este registro permanentemente?");
    
    if (!confirmar) return; // Se cancela la acción

    try {
        const response = await fetch(`https://proyectoiglesias.onrender.com/api/iglesia/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Registro eliminado correctamente.");
            cargarTablaIglesias(); // Actualiza la tabla automáticamente
        } else {
            const data = await response.json();
            alert(`Error al eliminar: ${data.message || 'Desconocido'}`);
        }
    } catch (error) {
        console.error("Error en la petición de eliminación:", error);
        alert("Error de conexión al intentar eliminar el registro.");
    }
};

// Inicializar la tabla cuando abra el panel
cargarTablaIglesias();