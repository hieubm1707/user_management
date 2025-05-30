import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => ({
  resource: sequelize.models.Salary,
  options: {
    navigation: {
      name: 'Salary Management',
      icon: 'Money',
    },
    properties: {
      id: {
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: false,
        },
      },
      userId: {
        reference: 'User',
        isRequired: true,
      },
      amount: {
        type: 'number',
        isRequired: true,
        
      },
      month: {
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: true,
        },
      },
      year: {
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: true,
        },
      },
      createdAt: {
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: false,
        },
      },
      updatedAt: {
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: false,
        },
      },
    },
  },
});