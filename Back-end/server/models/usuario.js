module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    grupo: DataTypes.INTEGER
  }, { tableName: 'Usuario' });

  Usuario.associate = function(models) {
    Usuario.belongsTo(models.Grupo, { foreignKey: 'grupo' });
    Usuario.hasMany(models.Iglesia, { foreignKey: 'usuario' });
  };
  return Usuario;
};