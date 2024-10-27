const { Model, DataTypes } = require("sequelize");

class LeadHistory extends Model {
  static associate(models) {
    this.belongsTo(models.Lead, {
      foreignKey: "lead_id",
      as: "lead",
    });
    this.belongsTo(models.File, {
      foreignKey: "file_id",
      as: "file",
    });
  }
}

module.exports = (sequelize) => {
  LeadHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      contact_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Lead",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fileId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Files",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "LeadHistory",
      tableName: "lead_histories",
      timestamps: true,
      underscored: true,
    }
  );

  return LeadHistory;
};
