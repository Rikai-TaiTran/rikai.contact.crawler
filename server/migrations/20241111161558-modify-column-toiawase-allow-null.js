"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("toiawase", "created_at", {
      type: Sequelize.DATE,
      allowNull: true, // Allow NULL values
    });
    await queryInterface.changeColumn("toiawase", "updated_at", {
      type: Sequelize.DATE,
      allowNull: true, // Allow NULL values
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("toiawase", "created_at", {
      type: Sequelize.DATE,
      allowNull: false, // Allow NULL values
    });
    await queryInterface.changeColumn("toiawase", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false, // Allow NULL values
    });
  },
};
