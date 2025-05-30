const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/**
 * @typedef {import('sequelize').QueryInterface} QueryInterface
 * @typedef {import('sequelize')} Sequelize
 */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    const hashedPassword1 = await bcrypt.hash('12345678', saltRounds);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          first_name: 'admin',
          last_name: '',
          username: 'admin',
          email: 'admin@gmail.com',
          password: hashedPassword1,
          role: 'admin',
          created_at: new Date(),
        },
      ],
      {},
    );
  },
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sessions', null, {});
    await queryInterface.bulkDelete('users', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
