'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
        'salaries',
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                field: 'id',
                comment: 'id of the salaries',
            },
            amount:{
                type: Sequelize.DOUBLE,
                allowNull: false,
                field: 'amount',
                comment: 'amount of the salaries',
            },
            month:{
                type: Sequelize.INTEGER,
                allowNull: false,
                field: 'month',
                comment: 'month of the salaries',
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: 'year',
                comment: 'year of the salaries',
            },
            createdat: {
                type: Sequelize.DATE,
                allowNull: false,
                field: 'createdat',
                comment: 'createdat of the salaries',
            },
            updatedat: {
                type: Sequelize.DATE,
                allowNull: false,
                field: 'updatedat',
                comment: 'updatedat of the salaries',
            },
            userid: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'userid',
                comment: 'userid of the users',
                references: {
                  model: 'users',
                  key: 'id'
                },
                onDelete: 'CASCADE'
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
        await queryInterface.addIndex('salaries', ['createdat'], {
            name: 'salaries_createdat_idx', 
        });
        await queryInterface.addIndex('salaries', ['updatedat'], {
            name: 'salaries_updatedat_idx',
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('salaries');
    },
};