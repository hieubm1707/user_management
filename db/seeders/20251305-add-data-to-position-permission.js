'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // DIRECTOR: all permissions (1-10)
    const directorPermissions = [1,2,3,4,5,6,7,8,9,10];
    // MANAGER: view_user, view_salary, add_salary, update_salary (1,5,6,7,9,10)
    const managerPermissions = [1,5,6,7,9,10];
    // STAFF: view_user, view_salary (1,5,9,10)
    const staffPermissions = [9,10];
    // INTERN: view_salary (9,10)
    const internPermissions = [9,10];

    const now = new Date();
    const data = [];
    directorPermissions.forEach(pid => data.push({ position_id: 1, permission_id: pid, createdAt: now, updatedAt: now }));
    managerPermissions.forEach(pid => data.push({ position_id: 2, permission_id: pid, createdAt: now, updatedAt: now }));
    staffPermissions.forEach(pid => data.push({ position_id: 3, permission_id: pid, createdAt: now, updatedAt: now }));
    internPermissions.forEach(pid => data.push({ position_id: 4, permission_id: pid, createdAt: now, updatedAt: now }));

    await queryInterface.bulkInsert('position_permissions', data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('position_permissions', null, {});
  }
};
