const { Model, DataTypes } = require("sequelize");

class LeadType extends Model {
  static associate(models) {
    // Liên kết với Lead (một LeadType có thể liên kết với nhiều Lead)
    this.hasMany(models.Lead, {
      foreignKey: "lead_type_id",
      as: "leads",
    });
  }
}

module.exports = (sequelize) => {
  LeadType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "LeadType",
      tableName: "lead_types",
      timestamps: true,
      underscored: true,
    }
  );

  return LeadType;
};
