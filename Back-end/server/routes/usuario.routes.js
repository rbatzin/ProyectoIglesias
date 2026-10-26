const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');
const verifyToken = require('../middlewares/verifyToken');

// Rutas Públicas (Sin token)
router.post('/login', controller.login);
router.post('/', controller.crear); 

// Rutas Protegidas (Con token)
router.get('/', verifyToken, controller.obtenerTodos);
router.get('/:id', verifyToken, controller.obtenerPorId);
router.put('/:id', verifyToken, controller.actualizar);
router.delete('/:id', verifyToken, controller.eliminar);

module.exports = router;