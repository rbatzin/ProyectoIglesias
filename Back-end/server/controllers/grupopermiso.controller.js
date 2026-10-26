const db = require('../models');
const GrupoPermiso = db.GrupoPermiso; // Ej: const Producto = db.Producto;

exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await GrupoPermiso.findAll(); // Busca todos los registros
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await GrupoPermiso.findByPk(id); // Busca por ID
    if (!dato) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(dato);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener por id', error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = await GrupoPermiso.create(req.body); // Crea un registro nuevo
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await GrupoPermiso.update(req.body, { where: { id } }); // Actualiza
    if (!actualizados) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await GrupoPermiso.destroy({ where: { id } }); // Borra de la BD
    if (!eliminados) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
