'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('router_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      route: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'HTTP method + route path (e.g., GET /users)'
      },
      permission_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the permission required for this route'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description of what this route does'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this route permission mapping is active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('route_permissions', ['route']);
    await queryInterface.addIndex('route_permissions', ['permission_name']);
    await queryInterface.addIndex('route_permissions', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('route_permissions');
  }
}; 