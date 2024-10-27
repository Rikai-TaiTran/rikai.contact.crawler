const { Model, DataTypes } = require('sequelize');

class LeadSource extends Model {
  static associate(models) {
    this.hasMany(models.Lead, {
      foreignKey: 'lead_source_id',
      as: 'leads'
    });
  }
}

module.exports = (sequelize) => {
  LeadSource.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'LeadSource',
    tableName: 'lead_sources',
    timestamps: true,
    underscored: true
  });

  return LeadSource;
};
