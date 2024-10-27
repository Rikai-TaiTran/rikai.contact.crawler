const { Model, DataTypes } = require('sequelize');

class ContactChannel extends Model {
  static associate(models) {
    this.hasMany(models.Lead, {
      foreignKey: 'contact_channel_id',
      as: 'leads'
    });
  }
}

module.exports = (sequelize) => {
  ContactChannel.init({
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
    modelName: 'ContactChannel',
    tableName: 'contact_channels',
    timestamps: true,
    underscored: true
  });

  return ContactChannel;
};
