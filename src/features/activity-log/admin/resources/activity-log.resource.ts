import { ResourceWithOptions } from 'adminjs';
import { Sequelize } from 'sequelize';
import { menu } from '..';

export default (sequelize: Sequelize): ResourceWithOptions => {
  const resource: ResourceWithOptions = {
    resource: sequelize.models.ActivityLogModel,
    options: {
      properties: {
        'properties.userEmail': {
          type: 'string',
          isVisible: { list: true, filter: true, show: true, edit: false }    
        },
      },
      actions: {
        delete: {
          isAccessible: true,
        },
        bulkDelete: {
          isAccessible: true,
        },
        edit: {
          isAccessible: true,
        },
        list: {
          isAccessible: true,
        },
        new: {
          isAccessible: true,
        },
        search: {
          isAccessible: true,
        },
        show: {
          isAccessible: true,
        },
      },
      navigation: menu.activityLog,
      listProperties: [
        'properties.userEmail',
        'description',
        'subjectType',
        'subjectId',
        'event',
        'causerType',
        'causerId',
        'properties',
        'batchUuid',
        'createdAt',
        'updatedAt',
        // insert list here
      ],
      showProperties: [
        'id',
        'logName',
        'description',
        'subjectType',
        'subjectId',
        'event',
        'causerType',
        'causerId',
        'properties',
        'batchUuid',
        'createdAt',
        'updatedAt',
        // insert show here
      ],
      editProperties: [
        'logName',
        'description',
        'subjectType',
        'subjectId',
        'event',
        'causerType',
        'causerId',
        'properties',
        'batchUuid',
        // insert edit here
      ],
      filterProperties: [
        'id',
        'logName',
        'description',
        'subjectType',
        'subjectId',
        'event',
        'causerType',
        'causerId',
        'properties',
        'batchUuid',
        // insert filter here
      ],
      sort: {
        direction: 'asc',
        sortBy: 'created_at',
      },
    },
  };

  return resource;
};
