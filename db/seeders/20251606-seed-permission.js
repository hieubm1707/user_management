'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permission', [

      //user permission
      { name: 'view_user', description: 'View user list', created_at: new Date(), updated_at: new Date() },
      { name: 'create_user', description: 'Create new user', created_at: new Date(), updated_at: new Date() },
      { name: 'update_user', description: 'Edit user information', created_at: new Date(), updated_at: new Date() },
      { name: 'delete_user', description: 'Delete user', created_at: new Date(), updated_at: new Date() },
      { name: 'view_own_user', description: 'View own user information', created_at: new Date(), updated_at: new Date() },
      { name: 'view_all_user', description: 'View all user information', created_at: new Date(), updated_at: new Date() },
      { name: 'use_filter', description: ' use filter to view user', created_at: new Date(), updated_at: new Date() },
      //salary permission
      { name: 'view_salary', description: 'View salary', created_at: new Date(), updated_at: new Date() },
      { name: 'add_salary', description: 'Add salary', created_at: new Date(), updated_at: new Date() },
      { name: 'update_salary', description: 'Update salary', created_at: new Date(), updated_at: new Date() },
      { name: 'delete_salary', description: 'Delete salary', created_at: new Date(), updated_at: new Date() },
      { name: 'view_own_salary', description: 'View own salary', created_at: new Date(), updated_at: new Date() },
      { name: 'view_all_salary', description: 'View all salary', created_at: new Date(), updated_at: new Date() },
      { name: 'salary_filter', description: ' use filter to view salary', created_at: new Date(), updated_at: new Date() },
      { name: 'sum_salary', description: 'sum salary', created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permission', {
      name: ['view_user', 'create_user', 'update_user', 'delete_user', 'view_salary', 'add_salary', 'update_salary', 'delete_salary', 'view_own_user', 'view_own_salary']
    });
  }
};