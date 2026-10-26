document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginValue = document.getElementById('login').value;
    const passwordValue = document.getElementById('password').value;
    const alertaBox = document.getElementById('mensaje-alerta');

    try {
        const response = await fetch('http://localhost:8010/api/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                login: loginValue, 
                password: passwordValue,
                grupo: 3 // Fuerza el grupo Consulta automáticamente
            })
        });

        if (response.ok) {
            alertaBox.className = 'alert alert-success small';
            alertaBox.textContent = 'Cuenta creada exitosamente. Redirigiendo...';
            alertaBox.classList.remove('d-none');
            document.getElementById('registroForm').reset();
            
            // Redirige al login después de 2 segundos
            setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            const data = await response.json();
            alertaBox.className = 'alert alert-danger small';
            alertaBox.textContent = data.message || 'Error al crear la cuenta. El usuario podría ya existir.';
            alertaBox.classList.remove('d-none');
        }
    } catch (error) {
        alertaBox.className = 'alert alert-danger small';
        alertaBox.textContent = 'Error de conexión con el servidor.';
        alertaBox.classList.remove('d-none');
    }
});