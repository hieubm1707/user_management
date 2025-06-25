import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => {
  const resource: ResourceWithOptions = {
    resource: sequelize.models.RouterPermissionModel,
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
      listProperties: ['id', 'route', 'permissionName', 'description', 'isActive', 'createdAt', 'updatedAt'],
      showProperties: ['id', 'route', 'permissionName', 'description', 'isActive', 'createdAt', 'updatedAt'],
      editProperties: ['route', 'permissionName', 'description', 'isActive'],
      filterProperties: ['id', 'route', 'permissionName', 'description', 'isActive', 'createdAt', 'updatedAt'],
      properties: {
        id: {
          isVisible: { list: true, filter: true, show: true, edit: false },
          type: 'number',
        },
        route: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'string',
        },
        permissionName: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'string',
        },
        description: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'string',
        },
        isActive: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'boolean',
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
        sortBy: 'route',
      },
    },
  };
  return resource;
};
