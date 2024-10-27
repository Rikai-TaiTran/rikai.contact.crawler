"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        email: "tai.tran@rikai.technology",
        full_name: "Tran Quoc Tai",
        password_hash: await bcrypt.hash("password", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "trang.tran@rikai.technology",
        full_name: "チャン美穂",
        password_hash: await bcrypt.hash("password", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "huynh.huynh@rikai.technology",
        full_name: "Huynh Thanh Huynh",
        password_hash: await bcrypt.hash("password", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
