"use strict";
import generateMyId from "../../utils/generateUuid";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.removeColumn("Users", "id"),
      queryInterface.addColumn("Users", "uuid", {
        type: Sequelize.UUID,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: function () {
          return generateMyId();
        },
      }),
      queryInterface.addColumn("Users", "phoneNumber", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.addColumn("Users", "isPhoneVerified", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn("Users", "isEmailVerified", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn("Users", "isAdmin", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn("Users", "userType", {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      }),
      queryInterface.addConstraint("Users", ["email"], {
        type: "unique",
        name: "custom_unique_constraint_name",
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
