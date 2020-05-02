export default (sequelize, DataTypes) => {
  const Ride = sequelize.define(
    "Ride",
    {
      origin: DataTypes.STRING,
      destination: DataTypes.STRING,
      departureTime: DataTypes.STRING,
    },
    {}
  );
  Ride.associate = (models) => {
    // associations can be defined here
  };
  return Ride;
};
