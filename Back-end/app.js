const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Configuración CORS básica (Tu estilo)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-Auth-Token, Origin, X-Requested-With, Content-Type, Accept, x-access-token"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

// 2. Seguridad para permitir que el Mapa de OpenStreetMap cargue
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://tile.openstreetmap.org", "https://*.tile.openstreetmap.org", "https://unpkg.com"],
        connectSrc: ["'self'"]
      },
    },
  })
);

// 3. Importación de las Rutas de tu Base de Datos
const grupoRoutes = require('./server/routes/grupo.routes');
app.use('/api/grupo', grupoRoutes);

const permisoRoutes = require('./server/routes/permiso.routes');
app.use('/api/permiso', permisoRoutes);

const grupopermisoRoutes = require('./server/routes/grupopermiso.routes');
app.use('/api/grupopermiso', grupopermisoRoutes);

const usuarioRoutes = require('./server/routes/usuario.routes');
app.use('/api/usuario', usuarioRoutes);

const iglesiaRoutes = require('./server/routes/iglesia.routes');
app.use('/api/iglesia', iglesiaRoutes);

// 4. Ruta raíz principal de la API (Elimina el intento de buscar la carpeta 'public')
app.get('/', (req, res) => {
    res.status(200).send('API de Iglesias funcionando correctamente en Render');
});

const db = require('./server/models');
const jwt = require('jsonwebtoken');

// Endpoint para consultar los permisos del usuario logueado
app.get('/api/mis-permisos', async (req, res) => {
    try {
        // 1. Extraer y verificar el token del encabezado
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(403).json({ message: 'Token requerido' });
        
        const token = authHeader.split(' ')[1];
        // Lee la clave dinámica de Render o toma la fallback
        const secret = process.env.JWT_SECRET || 'una_clave_super_secreta_y_larga_12345';
        const decoded = jwt.verify(token, secret);

        // 2. Buscar al usuario en la BD para saber su grupo
        const usuario = await db.Usuario.findByPk(decoded.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        // 3. Obtener los IDs de los permisos de su grupo
        const grupoPermisos = await db.GrupoPermiso.findAll({ 
            where: { grupo: usuario.grupo } 
        });
        const permisosIds = grupoPermisos.map(gp => gp.permiso);

        // 4. Obtener los nombres de los permisos
        const permisos = await db.Permiso.findAll({ 
            where: { id: permisosIds } 
        });

        // 5. Enviar la lista de permisos al Front-end
        res.status(200).json(permisos);
    } catch (error) {
        console.error("Error al obtener permisos:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = app;