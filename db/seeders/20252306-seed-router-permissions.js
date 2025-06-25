'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const routePermissions = [
      // User routes
      {
        route: 'GET /users/filter',
        permission_name: 'use_filter',
        description: 'Filter users with various criteria',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /users',
        permission_name: 'view_all_user',
        description: 'View all users in the system',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /users/me',
        permission_name: 'view_own_user',
        description: 'View own user profile',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /users/:userId',
        permission_name: 'view_user',
        description: 'View specific user details',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'POST /users',
        permission_name: 'create_user',
        description: 'Create new user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'PUT /users/:userId',
        permission_name: 'update_user',
        description: 'Update user information',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'DELETE /users/:userId',
        permission_name: 'delete_user',
        description: 'Delete user from system',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Salary routes
      {
        route: 'GET /salary/me',
        permission_name: 'view_own_salary',
        description: 'View own salary information',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /salary',
        permission_name: 'view_all_salary',
        description: 'View all salaries in the system',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /salary/sumsalary',
        permission_name: 'sum_salary',
        description: 'Calculate total salary for a user in date range',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /salary/sumall',
        permission_name: 'sum_salary',
        description: 'Calculate total salary for all users in date range',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /salary/filter',
        permission_name: 'salary_filter',
        description: 'Filter salaries with various criteria',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /salary/:userId',
        permission_name: 'view_salary_by_user',
        description: 'View salary information for specific user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'GET /salary/:userId/:year/:month',
        permission_name: 'view_salary_by_month',
        description: 'View salary for specific user in specific month/year',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'POST /salary/:userId',
        permission_name: 'add_salary',
        description: 'Add new salary record for user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'PUT /salary/:userId/:year/:month',
        permission_name: 'update_salary',
        description: 'Update salary for specific user in specific month/year',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        route: 'DELETE /salary/:userId/:year/:month',
        permission_name: 'delete_salary',
        description: 'Delete salary for specific user in specific month/year',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('route_permissions', routePermissions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('route_permissions', null, {});
  }
}; 