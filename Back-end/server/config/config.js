//El backend es generado automaticamente y nos genera un archivo config.json
//nosotros usamos este archivo como puente para evitar filtrar nuestras credenciales  
require('dotenv').config();
 
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
};
