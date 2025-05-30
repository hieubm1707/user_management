'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'activity_log',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          allowNull: false,
          unique: true,
          field: 'id',
          autoIncrement: true,
          comment: 'id of the activity_log',
        },
        logName: {
          type: Sequelize.STRING(191),
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'log_name',
          comment: 'log_name of the activity_log',
        },
        description: {
          type: Sequelize.TEXT,
          primaryKey: false,
          allowNull: false,
          unique: false,
          field: 'description',
          comment: 'description of the activity_log',
        },
        subjectType: {
          type: Sequelize.STRING(191),
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'subject_type',
          comment: 'subject_type of the activity_log',
        },
        subjectId: {
          type: Sequelize.BIGINT,
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'subject_id',
          comment: 'subject_id of the activity_log',
        },
        event: {
          type: Sequelize.STRING(191),
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'event',
          comment: 'event of the activity_log',
        },
        causerType: {
          type: Sequelize.STRING(191),
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'causer_type',
          comment: 'causer_type of the activity_log',
        },
        causerId: {
          type: Sequelize.BIGINT,
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'causer_id',
          comment: 'causer_id of the activity_log',
        },
        properties: {
          type: Sequelize.JSONB,
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'properties',
          comment: 'properties of the activity_log',
        },
        batchUuid: {
          type: Sequelize.CHAR(36),
          primaryKey: false,
          allowNull: true,
          unique: false,
          field: 'batch_uuid',
          comment: 'batch_uuid of the activity_log',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          field: 'created_at',
          comment: "Date and time of the news's creation date",
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          field: 'updated_at',
          comment: "Date and time of the news's last update",
        },
        // insert columns here
      },
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
    await queryInterface.addIndex('activity_log', ['id'], {
      name: 'activity_log_id_idx',
    });
    await queryInterface.addIndex('activity_log', ['log_name'], {
      name: 'activity_log_log_name_idx',
    });
    await queryInterface.addIndex('activity_log', ['subject_type'], {
      name: 'activity_log_subject_type_idx',
    });
    await queryInterface.addIndex('activity_log', ['subject_id'], {
      name: 'activity_log_subject_id_idx',
    });
    await queryInterface.addIndex('activity_log', ['causer_type'], {
      name: 'activity_log_causer_type_idx',
    });
    await queryInterface.addIndex('activity_log', ['causer_id'], {
      name: 'activity_log_causer_id_idx',
    });
    // insert indexes here
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('activity_log');
  },
};
