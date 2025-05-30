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
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            field: 'id',
            comment: 'ID of the user',
          },
          firstName: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'first_name',
            comment: 'First name of the user',
          },
          lastName: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'last_name',
            comment: 'Last name of the user',
          },
          username: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true,
            field: 'username',
            comment: 'Username of the user',
          },
          password: {
            type: Sequelize.STRING(64),
            allowNull: false,
            field: 'password',
            comment: 'Password of the user',
          },
          phone: {
            type: Sequelize.STRING(64),
            allowNull: true,
            field: 'phone',
            comment: 'Phone of the user',
          },
          email: {
            type: Sequelize.STRING(255),
            allowNull: true,
            field: 'email',
            comment: 'Email of the user',
          },
          image: {
            type: Sequelize.TEXT,
            allowNull: true,
            field: 'image',
            comment: 'Image of the user',
          },
          role: {
            type: Sequelize.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
            field: 'role',
            comment: 'User role',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'created_at',
            comment: "Date and time of the user's creation date",
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'updated_at',
            comment: "Date and time of the user's last update",
          },
        },
        {
          charset: 'utf8',
          collate: 'utf8_general_ci',
          transaction,
        },
      );

      await queryInterface.createTable(
        'sessions',
        {
          sid: {
            type: Sequelize.STRING(36),
            primaryKey: true,
            field: 'sid',
            allowNull: false,
          },
          expires: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'expires',
          },
          data: {
            type: Sequelize.TEXT,
            allowNull: true,
            field: 'data',
          },
        },
        {
          charset: 'utf8',
          collate: 'utf8_general_ci',
          transaction,
        },
      );
    });
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('session', { transaction });
      await queryInterface.dropTable('user', { transaction });
    });
  },
};
