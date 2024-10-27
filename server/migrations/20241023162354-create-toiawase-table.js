"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("toiawase", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company_address: {
        type: Sequelize.STRING,
      },
      business_activities: {
        type: Sequelize.STRING,
      },
      company_size: {
        type: Sequelize.STRING,
      },
      company_website: {
        type: Sequelize.STRING,
      },
      crawl_source: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      last_update_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_blacklist: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("toiawase");
  },
};
