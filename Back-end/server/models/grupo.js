module.exports = (sequelize, DataTypes) => {
  const Grupo = sequelize.define('Grupo', {
    nombre: DataTypes.STRING
  }, { tableName: 'Grupos' });

  Grupo.associate = function(models) {
    Grupo.hasMany(models.Usuario, { foreignKey: 'grupo' });
    Grupo.belongsToMany(models.Permiso, { through: models.GrupoPermiso, foreignKey: 'grupo' });
  };
  return Grupo;
};