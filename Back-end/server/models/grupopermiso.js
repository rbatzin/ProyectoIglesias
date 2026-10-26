module.exports = (sequelize, DataTypes) => {
  const GrupoPermiso = sequelize.define('GrupoPermiso', {
    grupo: DataTypes.INTEGER,
    permiso: DataTypes.INTEGER
  }, { tableName: 'GrupoPermisos' });
  return GrupoPermiso;
};