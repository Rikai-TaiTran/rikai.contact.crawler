const Sequelize = require("sequelize");
const config = require("../config/config.js")["development"];
const Lead = require("./Lead");
const LeadType = require("./LeadType");
const Toiawase = require("./Toiawase");
const User = require("./User");
const LeadSource = require("./LeadSource");
const LeadStatus = require("./LeadStatus");
const ContactChannel = require("./ContactChannel");
const LeadHistory = require("./LeadHistory");
const File = require("./File");
const ToiawaseHistory = require("./ToiawaseHistory");

// Khởi tạo Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Khởi tạo các model
const models = {
  Lead: Lead(sequelize),
  LeadType: LeadType(sequelize),
  Toiawase: Toiawase(sequelize),
  User: User(sequelize),
  LeadSource: LeadSource(sequelize),
  LeadStatus: LeadStatus(sequelize),
  ContactChannel: ContactChannel(sequelize),
  LeadHistory: LeadHistory(sequelize),
  File: File(sequelize),
  ToiawaseHistory: ToiawaseHistory(sequelize),
};

// Đăng ký các liên kết giữa các model
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Xuất models và sequelize
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
