const express = require('express');
const router = express.Router();
const controller = require('../controllers/grupopermiso.controller');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, controller.obtenerTodos);
router.get('/:id', verifyToken, controller.obtenerPorId);
router.post('/', verifyToken, controller.crear);
router.put('/:id', verifyToken, controller.actualizar);
router.delete('/:id', verifyToken, controller.eliminar);

module.exports = router;
