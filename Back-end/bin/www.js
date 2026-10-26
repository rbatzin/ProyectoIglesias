require('dotenv').config();
const app = require('../app');
const db = require('../server/models');

const PORT = process.env.PORT || 8010;

async function iniciar() {
  try {
    //verificamos credenciales para saber si ya hicimos conexion con la base de datos 
   await db.sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');
    //si todo funciono levantamos el servidor en el puerto definido en -env
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
  }
}

iniciar();
