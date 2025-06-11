'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'position_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'position_id',
      comment: 'Position ID reference',
      references: {
        model: 'positions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'position_id');
  }
}; 