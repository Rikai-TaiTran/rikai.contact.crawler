"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("lead_types", [
      {
        name: "Qualified Lead",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Unqualified Lead",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("lead_types", null, {});
  },
};
