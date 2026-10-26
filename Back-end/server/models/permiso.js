module.exports = (sequelize, DataTypes) => {
  const Permiso = sequelize.define('Permiso', {
    nombre: DataTypes.STRING
  }, { tableName: 'Permisos' });

  Permiso.associate = function(models) {
    Permiso.belongsToMany(models.Grupo, { through: models.GrupoPermiso, foreignKey: 'permiso' });
  };
  return Permiso;
};