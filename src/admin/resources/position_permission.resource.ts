import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => {
  const resource: ResourceWithOptions = {
    resource: sequelize.models.PositionPermission,
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
      listProperties: ['id', 'positionId', 'permissionId', 'createdAt', 'updatedAt'],
      showProperties: ['id', 'positionId', 'permissionId', 'createdAt', 'updatedAt'],
      editProperties: ['positionId', 'permissionId'],
      filterProperties: ['id', 'positionId', 'permissionId', 'createdAt', 'updatedAt'],
      properties: {
        id: {
          isVisible: { list: true, filter: true, show: true, edit: false },
          type: 'number',
        },
        positionId: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'number',
          reference: 'positions',
          isRequired: true,
        },
        permissionId: {
          isVisible: { list: true, filter: true, show: true, edit: true },
          type: 'number',
          reference: 'permission',
          isRequired: true,
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
      },
      sort: {
        direction: 'desc',
        sortBy: 'createdAt',
      },
    },
  };
  return resource;
};
