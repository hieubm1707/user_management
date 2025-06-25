export type ActivityLog = {
  id: string;
  log_name?: string;
  description: string;
  subject_type?: string;
  subject_id?: string;
  event?: string;
  causer_type?: string;
  causer_id?: string;
  properties?: object;
  batch_uuid?: string;
  created_at?: Date;
  updated_at?: Date;
  logType?: string;
  // insert formatted attributes here
};

export type CreateActivityLogDTO = {
  logName?: string;
  description: string;
  subjectType?: string;
  subjectId?: string;
  event?: string;
  causerType?: string;
  causerId?: string;
  properties?: object;
  batchUuid?: string;
  logType?: string;
  // insert create attributes here
};

export type UpdateActivityLogDTO = {
  logName?: string;
  description: string;
  subjectType?: string;
  subjectId?: string;
  event?: string;
  causerType?: string;
  causerId?: string;
  properties?: object;
  batchUuid?: string;
  logType?: string;
  // insert update attributes here
};

export type FilterActivityLogDTO = {
  id?: number;
  logName?: string;
  description?: string;
  subjectType?: string;
  subjectId?: string;
  event?: string;
  causerType?: string;
  causerId?: string;
  properties?: object;
  batchUuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  logType?: string;
  page?: number;
  limit?: number;
  // insert filter attributes here
};
