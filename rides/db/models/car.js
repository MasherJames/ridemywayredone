export default (sequelize, DataTypes) => {
  const Car = sequelize.define(
    "Car",
    {
      make: DataTypes.STRING,
      model: DataTypes.STRING,
      registrationNumber: DataTypes.STRING,
      capacity: DataTypes.NUMBER,
    },
    {}
  );
  Car.associate = (models) => {
    Car.belongsTo;
  };
  return Car;
};
