import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';
import { Container } from 'typedi';
import { ActivityLogService } from '../../features/activity-log/services';

export default (sequelize: Sequelize): ResourceWithOptions => {
  const resource: ResourceWithOptions = {
    resource: sequelize.models.UserModel,
    options: {
      actions: {
        delete: {
          isAccessible: true,

          after: async (response: any, request: any, context: any) => {
            const { record } = response;
            await Container.get(ActivityLogService).createActivityLog({
              causerId: context.currentAdmin.id,
              event: 'delete',
              description: `User ${record.params.email} deleted`,
              subjectType: 'user',
              subjectId: record.id,
              properties: {
                ...record.params,
              },
            });
            return response;
          },
        },
        bulkDelete: {
          isAccessible: true,
        },
        edit: {
          isAccessible: true,
          after: async (response: any, request: any, context: any) => {
            const { record } = response;

            const { salary } = request.payload;

            const activityLogService = Container.get(ActivityLogService);

            if (salary) {
              const logData = {
                causerId: context.currentAdmin.id,
                event: 'edit',
                description: `User ${record.params.email} updated with new salary`,
                subjectType: 'user',
                subjectId: record.id,
                properties: {
                  ...record.params,
                  salary,
                },
              };
              await activityLogService.createActivityLog(logData);

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

            const { salary } = request.payload;

            const activityLogService = Container.get(ActivityLogService);

            if (salary) {
              const logData = {
                causerId: context.currentAdmin.id,
                event: 'new',
                description: `New user ${record.params.email} created with salary`,
                subjectType: 'user',
                subjectId: record.id,
                properties: {
                  ...record.params,
                  salary,
                },
              };
              await activityLogService.createActivityLog(logData);

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
