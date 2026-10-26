//libreria que permite crear modificar archivos
const fs = require('fs');
// 'path' sirve para unir nombres de carpetas de forma segura (sin importar si es Windows o Mac).
const path = require('path');

// process.argv es un arreglo que atrapa lo que escribes en la terminal.
// Si escribes: "node generar-crud.js Producto"
const nombre = process.argv[2];

//  Si olvidaste poner el nombre de la tabla, te avisa y detiene el programa
if (!nombre) {
  console.log('Uso: node generar-crud.js NombreDelModelo');
  process.exit(1);
}

// Estandarización de nombres: Node.js convierte la palabra para que el código no tenga errores ortográficos.
// Si escribiste "producto", modeloMayus lo convierte en "Producto" (para los Modelos).
const modeloMayus = nombre.charAt(0).toUpperCase() + nombre.slice(1); 
// Y modeloMinus lo convierte en "producto" (para nombrar los archivos).
const modeloMinus = nombre.toLowerCase();                              

// EL MOLDE DEL CONTROLADOR:
// Usamos "Backticks" (las comillas invertidas ` `) porque nos permiten inyectar variables 
// usando ${variable} dentro de un texto larguísimo de múltiples líneas.
const controllerCode = `const db = require('../models');
const ${modeloMayus} = db.${modeloMayus}; // Ej: const Producto = db.Producto;

exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await ${modeloMayus}.findAll(); // Busca todos los registros
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await ${modeloMayus}.findByPk(id); // Busca por ID
    if (!dato) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(dato);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener por id', error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = await ${modeloMayus}.create(req.body); // Crea un registro nuevo
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await ${modeloMayus}.update(req.body, { where: { id } }); // Actualiza
    if (!actualizados) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await ${modeloMayus}.destroy({ where: { id } }); // Borra de la BD
    if (!eliminados) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
`;

// EL MOLDE DE LAS RUTAS:
// Crea el texto para el archivo de rutas, inyectando automáticamente el verifyToken (seguridad) en todas ellas.
const routesCode = `const express = require('express');
const router = express.Router();
const controller = require('../controllers/${modeloMinus}.controller');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, controller.obtenerTodos);
router.get('/:id', verifyToken, controller.obtenerPorId);
router.post('/', verifyToken, controller.crear);
router.put('/:id', verifyToken, controller.actualizar);
router.delete('/:id', verifyToken, controller.eliminar);

module.exports = router;
`;

// PREPARANDO EL TERRENO:
// Armamos la ruta de dónde deben vivir los archivos (ej. C:/proyecto/server/controllers)
const controllersDir = path.join(__dirname, 'server', 'controllers');
const routesDir = path.join(__dirname, 'server', 'routes');

// Verificamos si la carpeta existe. Si no existe (!fs.existsSync), la crea (fs.mkdirSync).
if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });

// LA CREACIÓN FÍSICA DE LOS ARCHIVOS:
// Crea un archivo nuevo (ej: producto.controller.js) y le pega todo el texto que guardamos en "controllerCode".
fs.writeFileSync(path.join(controllersDir, `${modeloMinus}.controller.js`), controllerCode);
fs.writeFileSync(path.join(routesDir, `${modeloMinus}.routes.js`), routesCode);

// AVISO FINAL:
// Imprime en la consola un mensaje amigable con las líneas exactas que debes pegar en tu app.js
console.log(` Listo: Se generaron server/controllers/${modeloMinus}.controller.js y server/routes/${modeloMinus}.routes.js`);
console.log(`Recuerda agregar en app.js:`);
console.log(`  const ${modeloMinus}Routes = require('./server/routes/${modeloMinus}.routes');`);
console.log(`  app.use('/api/${modeloMinus}', ${modeloMinus}Routes);`);