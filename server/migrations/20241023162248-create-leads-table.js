'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leads', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      position: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_website: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lead_source_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'lead_sources',
          key: 'id'
        }
      },
      contact_channel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'contact_channels',
          key: 'id'
        }
      },
      lead_status_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'lead_statuses',
          key: 'id'
        }
      },
      assigned_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      last_contact_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lead_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'lead_types',
          key: 'id'
        }
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('leads');
  }
};
