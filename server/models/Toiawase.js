const { Model, DataTypes } = require("sequelize");

class Toiawase extends Model {
  static associate(models) {
    this.hasMany(models.ToiawaseHistory, {
      foreignKey: "id",
      as: "toiawaseHistories",
    });
  }
}

module.exports = (sequelize) => {
  Toiawase.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyAddress: {
        type: DataTypes.STRING,
      },
      businessActivities: {
        type: DataTypes.STRING,
      },
      companySize: {
        type: DataTypes.STRING,
      },
      companyWebsite: {
        type: DataTypes.STRING,
      },
      crawlSource: {
        type: DataTypes.STRING,
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
      lastUpdateDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isBlacklist: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Toiawase",
      tableName: "toiawase",
      timestamps: true,
      underscored: true,
    }
  );

  return Toiawase;
};
