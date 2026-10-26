const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Configuración CORS básica
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

// 2. Seguridad Helmet
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

// 3. Importación de Rutas
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

// 4. Ruta raíz principal de la API
app.get('/', (req, res) => {
    res.status(200).send('API de Iglesias funcionando correctamente en Render');
});

const db = require('./server/models');
const jwt = require('jsonwebtoken');

// Endpoint para consultar permisos del usuario
app.get('/api/mis-permisos', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(403).json({ message: 'Token requerido' });
        
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'una_clave_super_secreta_y_larga_12345';
        const decoded = jwt.verify(token, secret);

        const usuario = await db.Usuario.findByPk(decoded.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        const grupoPermisos = await db.GrupoPermiso.findAll({ 
            where: { grupo: usuario.grupo } 
        });
        const permisosIds = grupoPermisos.map(gp => gp.permiso);

        const permisos = await db.Permiso.findAll({ 
            where: { id: permisosIds } 
        });

        res.status(200).json(permisos);
    } catch (error) {
        console.error("Error al obtener permisos:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = app;