const { Model, DataTypes } = require("sequelize");

class ToiawaseHistory extends Model {
  static associate(models) {
    ToiawaseHistory.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
    });
    ToiawaseHistory.belongsTo(models.Toiawase, {
      foreignKey: "toiawaseId",
      as: "toiawaseHistories",
    });
  }
}

module.exports = (sequelize) => {
  ToiawaseHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sendDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: false,
      },
      toiawaseId: {
        type: DataTypes.INTEGER,
        references: {
          model: "toiawase",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      isSendSuccess: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasMeeting: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rejection: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: "ToiawaseHistory",
      tableName: "toiawase_histories",
      timestamps: true,
      underscored: true,
    }
  );

  return ToiawaseHistory;
};
