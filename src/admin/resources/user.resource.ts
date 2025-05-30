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
            console.log('Hook after delete called:', record);
            if (record && record.id) {
              try {
                const activityLogService = Container.get(ActivityLogService);
                const logData: any = {
                  description: `Delete user ${record.params?.username || record.id}`,
                  subjectType: 'User',
                  event: 'deleted',
                  causerId: context.currentAdmin?.id ? Number(context.currentAdmin.id) : undefined,
                  properties: { userId: record.id }
                };
                if (!isNaN(Number(record.id))) {
                  logData.subjectId = Number(record.id);
                }
                console.log('Data sent to ActivityLogService:', logData);
                await activityLogService.createActivityLog(logData);
                console.log('Activity log saved to DB for user:', record.id);
              } catch (err) {
                console.error('Error logging activity when deleting user:', err);
              }
            } else {
              console.warn('No record to log activity when deleting user');
            }
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
            const salary = request.payload.salary;
            console.log('Hook after edit action called:', { record, salary });
            if (record && record.id && salary) {
              await sequelize.models.SalaryModel.create({
                userid: record.id,
                amount: salary,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              });
              try {
                const activityLogService = Container.get(ActivityLogService);
                console.log('Preparing to log activity (edit):', { id: record.id, salary });
                await activityLogService.createActivityLog({
                  description: `Change salary for user ${record.id}`,
                  subjectType: 'User',
                  subjectId: record.id,
                  event: 'updated',
                  properties: {
                    oldSalary: record.salary,
                    newSalary: salary,
                    user: record
                  }
                });
              } catch (err) {
                console.error('Error logging activity when editing user:', err);
              }
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
            console.log('Hook after new action called:', { record, salary });
            if (record && record.id && salary) {
              await sequelize.models.SalaryModel.create({
                userid: record.id,
                amount: salary,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              });
              try {
                const activityLogService = Container.get(ActivityLogService);
                console.log('Preparing to log activity (new):', { id: record.id, salary });
                await activityLogService.createActivityLog({
                  description: `Create new user`,
                  subjectType: 'User',
                  subjectId: record.id,
                  event: 'created',
                  properties: {
                    salary: salary,
                    user: record
                  }
                });
              } catch (err) {
                console.error('Error logging activity when creating user:', err);
              }
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
      listProperties: ['id', 'username', 'email', 'phone', 'firstName', 'lastName', 'createdAt', 'salary'],
      showProperties: ['id', 'username', 'email', 'phone', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'salary'],
      editProperties: ['username', 'email', 'phone', 'password', 'firstName', 'lastName','salary'],
      filterProperties: ['username', 'email', 'phone', 'firstName', 'lastName', 'createdAt'],
      properties: {
        password: {
          type: 'password',
        },
        salary: {
          isVisible: { list: true, filter: false, show: true, edit: true },
          type: 'number',
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
