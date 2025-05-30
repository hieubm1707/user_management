'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get list of userIds from users table
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Create salary record for each user (you can modify amount as needed)
    const salaries = users.map(user => ({
      id: uuidv4(),
      userId: user.id,
      amount: 1000, // or Math.random() * 10000, or manually set for each person
      month: 5,
      year: 2025,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('salaries', salaries);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('salaries', null, {});
  }
};