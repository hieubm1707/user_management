export type ActivityLog = {
  id: number;
  log_name?: string;
  description: string;
  subject_type?: string;
  subject_id?: number;
  event?: string;
  causer_type?: string;
  causer_id?: number;
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
  subjectId?: number;
  event?: string;
  causerType?: string;
  causerId?: number;
  properties?: object;
  batchUuid?: string;
  logType?: string;
  // insert create attributes here
};

export type UpdateActivityLogDTO = {
  logName?: string;
  description: string;
  subjectType?: string;
  subjectId?: number;
  event?: string;
  causerType?: string;
  causerId?: number;
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
  subjectId?: number;
  event?: string;
  causerType?: string;
  causerId?: number;
  properties?: object;
  batchUuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  logType?: string;
  // insert filter attributes here
};
