module.exports = (sequelize, DataTypes) => {
  const Iglesia = sequelize.define('Iglesia', {
    nombre: DataTypes.STRING,
    tipo: DataTypes.STRING,
    descripcion: DataTypes.TEXT, 
    departamento: DataTypes.STRING,
    municipio: DataTypes.STRING,
    direccion: DataTypes.STRING,
    latitud: DataTypes.DECIMAL(10, 8),
    longitud: DataTypes.DECIMAL(11, 8),
    enlace_maps: DataTypes.TEXT,
    estado: { type: DataTypes.STRING, defaultValue: 'activo' }, 
    usuario: DataTypes.INTEGER
  }, { tableName: 'Iglesia' });

  Iglesia.associate = function(models) {
    Iglesia.belongsTo(models.Usuario, { foreignKey: 'usuario' });
  };
  return Iglesia;
};