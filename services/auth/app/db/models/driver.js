import generateMyId from "../../utils/generateUuid";

export default (sequelize, DataTypes) => {
  const Driver = sequelize.define(
    "Driver",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: function () {
          return generateMyId();
        },
        primaryKey: true,
        autoIncrement: false,
      },
      licenseNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
      ntsaNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {}
  );
  Driver.associate = (models) => {
    Driver.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Driver;
};
