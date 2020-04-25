import generateMyId from "../../utils/generateUuid";

export default (sequelize, DataTypes) => {
  const Passenger = sequelize.define(
    "Passenger",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: function () {
          return generateMyId();
        },
        primaryKey: true,
      },
      nationalId: { type: DataTypes.STRING, allowNull: false, unique: true },
      placeOfResidence: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  Passenger.associate = (models) => {
    Passenger.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Passenger;
};
