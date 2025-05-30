import { ActivityLogModel } from '../models';
import { ActivityLog } from '../types';

export const activityLogDTO = (activityLog: ActivityLogModel): ActivityLog => {
  const activityLogDto: ActivityLog = {
    id: activityLog.id,
    log_name: activityLog.logName,
    description: activityLog.description,
    subject_type: activityLog.subjectType,
    subject_id: activityLog.subjectId,
    event: activityLog.event,
    causer_type: activityLog.causerType,
    causer_id: activityLog.causerId,
    properties: activityLog.properties,
    batch_uuid: activityLog.batchUuid,
    created_at: activityLog.createdAt,
    updated_at: activityLog.updatedAt,
    // insert formatted attributes here
  };

  return activityLogDto;
};
