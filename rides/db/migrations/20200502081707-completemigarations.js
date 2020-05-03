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
      queryInterface.removeColumn("Cars", "id"),
      queryInterface.addColumn("Cars", "uuid", {
        type: Sequelize.UUID,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: function () {
          return generateMyId();
        },
      }),
      queryInterface.addColumn("Cars", "driver", {
        type: Sequelize.UUID,
        allowNull: false,
      }),
      queryInterface.changeColumn("Cars", "make", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Cars", "model", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Cars", "registrationNumber", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.changeColumn("Cars", "capacity", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.removeColumn("Rides", "id"),
      queryInterface.addColumn("Rides", "uuid", {
        type: Sequelize.UUID,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: function () {
          return generateMyId();
        },
      }),
      queryInterface.addColumn("Rides", "driver", {
        type: Sequelize.UUID,
        allowNull: false,
      }),
      queryInterface.changeColumn("Rides", "origin", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Rides", "destination", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Rides", "departureTime", {
        type: Sequelize.STRING,
        allowNull: false,
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
