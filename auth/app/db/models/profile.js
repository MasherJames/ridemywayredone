import { generateUuid } from "../../utils";

export default (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "Profile",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: function () {
          return generateUuid();
        },
        primaryKey: true,
      },
      profilePicture: { type: DataTypes.STRING },
      userName: { type: DataTypes.STRING },
      middleNae: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
    },
    {}
  );
  Profile.associate = function (models) {
    Profile.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Profile;
};
