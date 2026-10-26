require('dotenv').config();
const app = require('../app');
const db = require('../server/models');

const PORT = process.env.PORT || 8010;

async function iniciar() {
  try {
    // 1. Verificar credenciales
    await db.sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    // 2. Crear / Sincronizar tablas en la base de datos de Render
    await db.sequelize.sync();
    console.log('Tablas sincronizadas y creadas exitosamente en PostgreSQL.');

    // 3. Levantar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar o sincronizar la base de datos:', error.message);
  }
}

iniciar();