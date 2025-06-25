import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => {
  const resource: ResourceWithOptions = {
    resource: sequelize.models.SalaryModel,
    options: {
      actions: {
        list: { isAccessible: true },
        show: { isAccessible: true },
        new: { isAccessible: true },
        edit: { isAccessible: true },
        delete: { isAccessible: true },
        bulkDelete: { isAccessible: true },
        search: { isAccessible: true },
        
      },
      navigation: menu.users, 
      listProperties: ['id', 'userid', 'amount', 'month', 'year', 'createdAt', 'updatedAt'],
      showProperties: ['id', 'userid', 'amount', 'month', 'year', 'createdAt', 'updatedAt'],
      editProperties: ['userid', 'amount', 'month', 'year'],
      filterProperties: ['id', 'userid', 'amount', 'month', 'year', 'createdAt', 'updatedAt'],
      properties: {
        id: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        userid: {
          reference: 'users',
          isRequired: true,
          isVisible: { list: true, filter: true, show: true, edit: true },
        },
        amount: {
          type: 'number',
          isRequired: true,
        },
        month: {
          isVisible: { list: true, filter: true, show: true, edit: true },
        },
        year: {
          isVisible: { list: true, filter: true, show: true, edit: true },
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
      },
    },
  };
  return resource;
};