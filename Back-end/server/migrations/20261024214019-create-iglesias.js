'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Iglesia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: { type: Sequelize.STRING },
      descripcion: {type: Sequelize.TEXT},
      tipo: { type: Sequelize.STRING },
      departamento: { type: Sequelize.STRING },
      municipio: { type: Sequelize.STRING },
      direccion: { type: Sequelize.STRING },
      latitud: { type: Sequelize.DECIMAL(10, 8) },
      longitud: { type: Sequelize.DECIMAL(11, 8) },
      enlace_maps: { type: Sequelize.TEXT },
      usuario: {
        type: Sequelize.INTEGER,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      estado: {type: Sequelize.STRING,defaultValue: 'activo'},
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Iglesia');
  }
};