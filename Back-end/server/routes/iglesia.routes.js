const express = require('express');
const router = express.Router();
const controller = require('../controllers/iglesia.controller');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', verifyToken, controller.crear);
router.put('/:id', verifyToken, controller.actualizar);
router.delete('/:id', verifyToken, controller.eliminar);

module.exports = router;
