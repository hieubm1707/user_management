import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => {
  const resource: ResourceWithOptions = {
    resource: sequelize.models.Permission,
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
      navigation: menu.users, // or create a separate menu if desired
      listProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
      showProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
      editProperties: ['name', 'description'],
      filterProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
      properties: {
        id: {
          isVisible: { list: true, filter: true, show: true, edit: false },
          type: 'number',
        },
        name: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'string',
        },
        description: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'string',
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
      },
      sort: {
        direction: 'asc',
        sortBy: 'name',
      },
    },
  };
  return resource;
};
