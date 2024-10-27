const { Model, DataTypes } = require('sequelize');

class LeadStatus extends Model {
  static associate(models) {
    this.hasMany(models.Lead, {
      foreignKey: 'lead_status_id',
      as: 'leads'
    });
  }
}

module.exports = (sequelize) => {
  LeadStatus.init({
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
    modelName: 'LeadStatus',
    tableName: 'lead_statuses',
    timestamps: true,
    underscored: true
  });

  return LeadStatus;
};
