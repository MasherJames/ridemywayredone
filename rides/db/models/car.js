import generateUuid from "../../utils//generateUuid";

export default (sequelize, DataTypes) => {
  const Car = sequelize.define(
    "Car",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: function () {
          return generateUuid();
        },
        primaryKey: true,
        autoIncrement: false,
      },
      make: { type: DataTypes.STRING, allowNull: false },
      model: { type: DataTypes.STRING, allowNull: false },
      registrationNumber: { type: DataTypes.STRING, unique: true },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      driver: { type: DataTypes.UUID, allowNull: false },
    },
    {}
  );
  Car.associate = (models) => {
    Car.hasMany(models.Ride, {
      foreignKey: "carId",
    });
  };
  return Car;
};
