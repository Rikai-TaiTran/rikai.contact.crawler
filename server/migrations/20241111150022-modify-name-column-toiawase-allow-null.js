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
    await queryInterface.changeColumn("toiawase", "company_name", {
      type: Sequelize.STRING,
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
    await queryInterface.changeColumn("toiawase", "company_name", {
      type: Sequelize.STRING,
      allowNull: false, // Revert back to NOT NULL in case of rollback
    });
  },
};
