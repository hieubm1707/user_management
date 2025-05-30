import { NotFound } from 'http-errors';
import { i18n as I18n } from 'i18next';
import { CreationAttributes } from 'sequelize';
import { Inject, Service } from 'typedi';
import { activityLogDTO } from '../dto';
import { ActivityLogModel } from '../models';
import {
  ActivityLog,
  CreateActivityLogDTO,
  FilterActivityLogDTO,
  UpdateActivityLogDTO,
} from '../types';

@Service()
export default class ActivityLogService {
  @Inject('i18n')
  i18n!: I18n;

  /**
   * Returns the details of a activityLog or throws a `NotFound` error if not found.
   */
  async getActivityLogById(activityLogId: string): Promise<ActivityLog> {
    const activityLog = await ActivityLogModel.findByPk(activityLogId);

    if (!activityLog) {
      throw new NotFound(this.i18n.t('errors:dataNotFound'));
    }

    return activityLogDTO(activityLog);
  }

  /**
   * Creates a new activityLog or throws a `BadRequest` error if a activityLog already exists.
   */
  async createActivityLog(activityLogDetails: CreateActivityLogDTO): Promise<ActivityLog> {
    // check exist model
    console.log('Data sent to ActivityLogService:', activityLogDetails);
    const activityLog = await ActivityLogModel.create(
      activityLogDetails as CreationAttributes<ActivityLogModel>,
    );
    return activityLogDTO(activityLog);
  }

  /**
   * Returns list activityLogs by filtering them.
   */

  async getActivityLog(filter: FilterActivityLogDTO): Promise<ActivityLog[]> {
    const activityLog = await ActivityLogModel.findAll({ where: filter });

    return activityLog.map(activityLogDTO);
  }

  /**
   * Creates a new activityLog or throws a `BadRequest` error if a activityLog already exists.
   */
  async updateActivityLog(
    activityLogId: string,
    activityLogDetails: UpdateActivityLogDTO,
  ): Promise<ActivityLog> {
    const activityLog = await ActivityLogModel.findByPk(activityLogId);

    if (!activityLog) {
      throw new NotFound(this.i18n.t('errors:dataNotFound'));
    }

    // check exist model

    await activityLog.update(activityLogDetails as CreationAttributes<ActivityLogModel>);

    return activityLogDTO(activityLog);
  }

  /**
   * Deletes a activityLog or throws a `NotFound` error if not found.
   */
  async deleteActivityLog(activityLogId: string): Promise<void> {
    const activityLog = await ActivityLogModel.findByPk(activityLogId);

    if (!activityLog) {
      throw new NotFound(this.i18n.t('errors:dataNotFound'));
    }

    await activityLog.destroy();
  }
  /// //// Add the following methods here ///////
}
