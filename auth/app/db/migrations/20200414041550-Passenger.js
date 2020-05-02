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
      queryInterface.changeColumn("Users", "firstName", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Users", "lastName", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Users", "email", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.changeColumn("Passengers", "nationalId", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.changeColumn("Passengers", "placeOfResidence", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.removeColumn("Passengers", "id"),
      queryInterface.addColumn("Passengers", "userId", {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
