'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
        'salaries',
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                unique: true,
                allowNull: false,
                field: 'id',
                autoIncrement: true,
                comment: 'id of the salaries',
            },
            amount:{
                type: Sequelize.BIGINT,
                primaryKey: false,
                allowNull: true,
                field: 'amount',
                comment: 'amount of the salaries',
            },
            month:{
                type: Sequelize.INTEGER,
                primaryKey: false,
                allowNull: true,
                field: 'month',
                comment: 'month of the salaries',
            },
            year: {
                type: Sequelize.INTEGER,
                primaryKey: false,
                unique: false,
                allowNull: true,
                field: 'year',
                comment: 'year of the salaries',
            },
            createdAt: {
                type: Sequelize.DATE,
                primaryKey: false,
                allowNull: false,
                unique: false,
                field: 'created_at',
                comment: 'createdat of the salaries',
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                unique: false,
                field: 'updated_at',
                comment: 'timestamp of the last update of salaries',
            },
            userid: {
                type: Sequelize.BIGINT,
                foreignKey: true,
                allowNull: false,
                field: 'userid',
                comment: 'userid of the users',
            }
        },
        {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        }
        );
        await queryInterface.addIndex('salaries', ['id'], {
            name: 'salaries_id_idx',
        });
        await queryInterface.addIndex('salaries', ['userid'], {
            name: 'salaries_userid_idx',
        });
        await queryInterface.addIndex('salaries', ['amount'], {
            name: 'salaries_amount_idx',
        });
        await queryInterface.addIndex('salaries', ['month'], {
            name: 'salaries_month_idx',
        });
        await queryInterface.addIndex('salaries', ['year'], {
            name: 'salaries_year_idx',
        });
        await queryInterface.addIndex('salaries', ['created_at'], {
            name: 'salaries_created_at_idx', 
        });
        await queryInterface.addIndex('salaries', ['updated_at'], {
            name: 'salaries_updated_at_idx',
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('salaries');
    },
};