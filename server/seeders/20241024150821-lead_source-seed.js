"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("lead_sources", [
      {
        name: "quảng cáo",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "sự kiện",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "website",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "giới thiệu",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "email marketing",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "khác",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("lead_sources", null, {});
  },
};
