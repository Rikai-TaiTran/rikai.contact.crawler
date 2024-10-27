const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static associate(models) {
    // Liên kết với Toiawase (một User có thể tạo nhiều Toiawase)
    this.hasMany(models.ToiawaseHistory, {
      foreignKey: "senderId",
      as: "toiawaseHistories",
    });

    // Liên kết với Lead (một User có thể quản lý nhiều Lead)
    this.hasMany(models.Lead, {
      foreignKey: "assigned_user_id",
      as: "leads",
    });
  }
}

module.exports = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};
