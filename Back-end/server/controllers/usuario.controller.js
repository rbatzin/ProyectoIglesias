const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función nueva para iniciar sesión
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    
    // 1. Buscar al usuario
    const usuario = await Usuario.findOne({ where: { login } });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // 2. Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // 3. Generar Token
    const token = jwt.sign(
      { id: usuario.id, login: usuario.login, grupo: usuario.grupo }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Login exitoso', token, usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// CRUD Modificado (Encripta la contraseña antes de guardar)
exports.crear = async (req, res) => {
  try {
    const { login, password, grupo } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const nuevo = await Usuario.create({
      login,
      password: passwordEncriptada,
      grupo
    }); 
    
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await Usuario.findAll(); 
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await Usuario.findByPk(id); 
    if (!dato) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(dato);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener por id', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Si envían una nueva contraseña, encriptarla
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const [actualizados] = await Usuario.update(req.body, { where: { id } }); 
    if (!actualizados) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await Usuario.destroy({ where: { id } }); 
    if (!eliminados) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};