import generateUuid from "../../utils//generateUuid";

export default (sequelize, DataTypes) => {
  const Ride = sequelize.define(
    "Ride",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: function () {
          return generateUuid();
        },
        primaryKey: true,
        autoIncrement: false,
      },
      origin: { type: DataTypes.STRING, allowNull: false },
      destination: { type: DataTypes.STRING, allowNull: false },
      departureTime: { type: DataTypes.STRING, allowNull: false },
      driver: { type: DataTypes.UUID, allowNull: false },
    },
    {}
  );
  Ride.associate = (models) => {
    // associations can be defined here
  };
  return Ride;
};
