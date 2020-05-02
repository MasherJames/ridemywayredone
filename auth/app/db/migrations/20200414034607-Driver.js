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
      queryInterface.removeColumn("Drivers", "id"),
      queryInterface.addColumn("Drivers", "uuid", {
        type: Sequelize.UUID,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: function () {
          return generateMyId();
        },
      }),
      queryInterface.addConstraint("Users", ["uuid"], {
        type: "unique",
        name: "Users_uuid_key",
      }),
      queryInterface.addColumn("Drivers", "userId", {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
      queryInterface.changeColumn("Drivers", "licenseNumber", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.changeColumn("Drivers", "ntsaNumber", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
