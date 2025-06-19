'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('positions', [
      {
        id: 1,
        name: 'DIRECTOR',
        description: 'Director',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'MANAGER',
        description: 'Manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'STAFF',
        description: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
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