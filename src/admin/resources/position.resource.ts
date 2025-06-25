import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => ({
  resource: sequelize.models.PositionModel,
  options: {
    navigation: {
      name: 'Position Management',
      icon: 'UserCheck',
    },
    properties: {
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false },
        type: 'number',
      },
      name: {
        isVisible: { list: true, filter: true, show: true, edit: true },
        availableValues: [
          { value: 'DIRECTOR', label: 'Director' },
          { value: 'MANAGER', label: 'Manager' },
          { value: 'STAFF', label: 'Staff' },
          { value: 'INTERN', label: 'Intern' },
        ],
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
    listProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
    showProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
    editProperties: ['name', 'description'],
    filterProperties: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
  },
}); 