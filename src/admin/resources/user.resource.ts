import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => {
  const resource: ResourceWithOptions = {
    resource: sequelize.models.UserModel,
    options: {
      actions: {
        delete: {
          isAccessible: true,
        },
        bulkDelete: {
          isAccessible: true,
        },
        edit: {
          isAccessible: true,
          after: async (response: any, request: any, context: any) => {
            const { record } = response;
            const salary = request.payload.salary ?? record.salary;
            if (record && record.id && salary !== undefined && salary !== null) {
              await sequelize.models.SalaryModel.create({
                userid: record.id,
                amount: salary,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              });
            }
            return response;
          },
        },
        list: {
          isAccessible: true,
        },
        new: {
          isAccessible: true,
          after: async (response: any, request: any, context: any) => {
            const { record } = response;
            const salary = request.payload.salary;
            if (record && record.id) {
              await sequelize.models.SalaryModel.create({
                userid: record.id,
                amount: salary,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              });
            }
            return response;
          },
        },
        search: {
          isAccessible: true,
        },
        show: {
          isAccessible: true,
        },
      },
      navigation: menu.users,
      listProperties: ['id', 'username', 'email', 'phone', 'firstName', 'lastName', 'createdAt', 'salary', 'role'],
      showProperties: ['id', 'username', 'email', 'phone', 'firstName', 'lastName', 'salary','role', 'createdAt', 'updatedAt'],
      editProperties: ['username', 'email', 'phone', 'password', 'role', 'salary', 'firstName', 'lastName'],
      filterProperties: ['id','username', 'email', 'phone', 'role', 'firstName', 'lastName', 'createdAt'],
      properties: {
        password: {
          type: 'password',
        },
        salary: {
          isVisible: { list: true, filter: false, show: true, edit: true },
          type: 'number',
        },
        role: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'string',
        },
      },
      sort: {
        direction: 'asc',
        sortBy: 'lastName',
      },
    },
  };

  return resource;
};
