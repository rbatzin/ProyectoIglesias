document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginValue = document.getElementById('login').value;
    const passwordValue = document.getElementById('password').value;
    const errorBox = document.getElementById('mensaje-error');

    try {
        const response = await fetch('https://proyectoiglesias.onrender.com/api/usuario/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                login: loginValue, 
                password: passwordValue 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardamos el token en la memoria del navegador
            localStorage.setItem('token', data.token);
            // Redirigimos al dashboard administrativo
            window.location.href = '../dashboard.html';
        } else {
            errorBox.textContent = data.message || 'Usuario o contraseña incorrectos';
            errorBox.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        errorBox.textContent = 'Error al conectar con el servidor.';
        errorBox.classList.remove('d-none');
    }
});