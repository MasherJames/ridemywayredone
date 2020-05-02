export default (sequelize, DataTypes) => {
  const phoneVerification = sequelize.define(
    "phoneVerification",
    {
      token: DataTypes.STRING,
    },
    {}
  );
  phoneVerification.associate = function(models) {
    phoneVerification.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return phoneVerification;
};
