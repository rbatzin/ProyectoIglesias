const db = require('../models');
const Iglesia = db.Iglesia; // Ej: const Producto = db.Producto;

exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await Iglesia.findAll(); // Busca todos los registros
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await Iglesia.findByPk(id); // Busca por ID
    if (!dato) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(dato);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener por id', error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    // 1. Forzar el estado a inactivo (Borrador para revisión)
    req.body.estado = 'inactivo';

    // 2. Verificar si ya existe un lugar con el mismo nombre
    const iglesiaDuplicada = await Iglesia.findOne({ 
        where: { nombre: req.body.nombre } 
    });
    if (iglesiaDuplicada) {
        return res.status(400).json({ message: 'Ya existe un lugar registrado con este nombre.' });
    }

    // 3. Verificar si ya existe otro registro en las mismas coordenadas
    const ubicacionDuplicada = await Iglesia.findOne({ 
        where: { latitud: req.body.latitud, longitud: req.body.longitud } 
    });
    if (ubicacionDuplicada) {
        return res.status(400).json({ message: 'Ya existe un lugar en estas coordenadas exactas.' });
    }

    // 4. Guardar (Solo debe existir un Iglesia.create en toda la función)
    const nuevo = await Iglesia.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {

    // Código existente para actualizar...
    await Iglesia.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Registro actualizado" });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await Iglesia.destroy({ where: { id } }); // Borra de la BD
    if (!eliminados) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
