"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn("Passengers", "uuid", {
        type: Sequelize.UUID,
        primaryKey: true,
        autoIncrement: false,
        unique: true,
        allowNull: false,
        defaultValue: function () {
          return generateMyId();
        },
      }),
      queryInterface.addColumn("Profiles", "uuid", {
        type: Sequelize.UUID,
        primaryKey: true,
        autoIncrement: false,
        unique: true,
        allowNull: false,
        defaultValue: function () {
          return generateMyId();
        },
      }),
      queryInterface.addColumn("Profiles", "userId", {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
      queryInterface.removeColumn("Profiles", "id"),
      queryInterface.addConstraint("Drivers", ["uuid"], {
        type: "unique",
        name: "Drivers_uuid_key",
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
