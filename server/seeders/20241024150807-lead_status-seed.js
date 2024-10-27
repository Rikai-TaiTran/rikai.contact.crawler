"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("lead_statuses", [
      {
        name: "mới",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "đang chăm sóc",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "đã liên hệ",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "đã họp",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
