const { Model, DataTypes } = require("sequelize");

class Lead extends Model {
  static associate(models) {
    // Liên kết với LeadType
    this.belongsTo(models.LeadType, {
      foreignKey: "lead_type_id",
      as: "leadType",
    });

    // Liên kết với LeadSource
    this.belongsTo(models.LeadSource, {
      foreignKey: "lead_source_id",
      as: "leadSource",
    });

    // Liên kết với LeadStatus
    this.belongsTo(models.LeadStatus, {
      foreignKey: "lead_status_id",
      as: "leadStatus",
    });

    // Liên kết với ContactChannel
    this.belongsTo(models.ContactChannel, {
      foreignKey: "contact_channel_id",
      as: "contactChannel",
    });

    // Liên kết với User (Người sở hữu lead)
    this.belongsTo(models.User, {
      foreignKey: "assigned_user_id",
      as: "user",
    });

    // Liên kết với LeadHistory (có thể có nhiều lịch sử)
    this.hasMany(models.LeadHistory, {
      foreignKey: "lead_id",
      as: "leadHistories",
    });
  }
}

module.exports = (sequelize) => {
  Lead.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
      },
      position: {
        type: DataTypes.STRING,
      },
      company_website: {
        type: DataTypes.STRING,
      },
      company_address: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      leadSourceId: {
        type: DataTypes.INTEGER,
        references: {
          model: "LeadSources",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      leadTypeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "LeadTypes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      leadStatusId: {
        type: DataTypes.INTEGER,
        references: {
          model: "LeadStatuses", // Tên bảng liên quan
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      contactChannelId: {
        type: DataTypes.INTEGER,
        references: {
          model: "ContactChannels", // Tên bảng liên quan
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      assignedUserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Tên bảng liên quan
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lastContactDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      modelName: "Lead",
      tableName: "leads",
      timestamps: true,
      underscored: true,
    }
  );

  return Lead;
};
