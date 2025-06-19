'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('positions', { level: 100 }, { name: 'DIRECTOR' });
    await queryInterface.bulkUpdate('positions', { level: 50 }, { name: 'MANAGER' });
    await queryInterface.bulkUpdate('positions', { level: 10 }, { name: 'STAFF' });
    await queryInterface.bulkUpdate('positions', { level: 1 }, { name: 'INTERN' });
  },

  async down(queryInterface, Sequelize) {
    // If rollback, reset level to 1 for all
    await queryInterface.bulkUpdate('positions', { level: 1 }, {});
  }
}; 