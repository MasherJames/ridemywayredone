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
      queryInterface.addConstraint("Cars", ["uuid"], {
        type: "unique",
        name: "Cars_uuid_key",
      }),
      queryInterface.addConstraint("Rides", ["uuid"], {
        type: "unique",
        name: "Rides_uuid_key",
      }),
      queryInterface.addColumn("Rides", "carId", {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Cars",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
