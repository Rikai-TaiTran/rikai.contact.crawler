"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("contact_channels", [
      {
        name: "email",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "điện thoại",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "mạng xã hội",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("contact_channels", null, {});
  },
};
