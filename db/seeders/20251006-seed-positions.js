'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('positions', [
      {
        name: 'DIRECTOR',
        description: 'Director',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MANAGER',
        description: 'Manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'STAFF',
        description: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'INTERN',
        description: 'Intern',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('positions', null, {});
  }
}; 