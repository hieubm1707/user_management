import { RequestHandler } from 'express';
import Router from 'express-promise-router';
import { Container } from 'typedi';
import { transformKeysMiddleware, validation } from '../middlewares';
import { ActivityLogService } from '../services';
import {
  ActivityLog,
  CreateActivityLogDTO,
  FilterActivityLogDTO,
  UpdateActivityLogDTO,
} from '../types';

const router = Router();

/**
 * GET /activityLog
 *
 * Get activityLog list by filtering
 */
router.get<{}, ActivityLog[], {}, FilterActivityLogDTO>(
  '/',
  transformKeysMiddleware as RequestHandler<{}, ActivityLog[], {}, FilterActivityLogDTO>,
  async (req, res) => {
    const filter = req.query;

    const activityLog = await Container.get(ActivityLogService).getActivityLog(filter);

    res.status(200).json(activityLog);
  },
);

/**
 * GET /activityLog/:activityLogId
 *
 * Get activityLog details
 */
router.get<{ activityLogId: string }, ActivityLog>(
  '/:activityLogId',
  validation.celebrate({
    params: {
      activityLogId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {
    const { activityLogId } = req.params;

    const activityLog = await Container.get(ActivityLogService).getActivityLogById(activityLogId);

    res.status(200).json(activityLog);
  },
);

/**
 * POST /activityLog
 *
 * Create new activityLog
 */
router.post<{}, ActivityLog, CreateActivityLogDTO>(
  '/',
  validation.celebrate({
    body: validation.createActivityLogSchema,
  }),
  transformKeysMiddleware,
  async (req, res) => {
    const activityLogDetails = req.body;

    const activityLog = await Container.get(ActivityLogService).createActivityLog(
      activityLogDetails,
    );

    res.status(201).json(activityLog);
  },
);

/**
 * PUT /activityLog/:activityLogId
 *
 * Update activityLog
 */
router.put<{ activityLogId: string }, ActivityLog, UpdateActivityLogDTO>(
  '/:activityLogId',
  validation.celebrate({
    params: {
      activityLogId: validation.schemas.uuid.required(),
    },
    body: validation.updateActivityLogSchema,
  }),
  transformKeysMiddleware,
  async (req, res) => {
    const { activityLogId } = req.params;
    const activityLogDetails = req.body;

    const activityLog = await Container.get(ActivityLogService).updateActivityLog(
      activityLogId,
      activityLogDetails,
    );

    res.status(200).json(activityLog);
  },
);

/**
 * DELETE /activityLog/:activityLogId
 *
 * Delete activityLog
 *
 */
router.delete<{ activityLogId: string }, void>(
  '/:activityLogId',
  validation.celebrate({
    params: {
      activityLogId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {
    const { activityLogId } = req.params;

    await Container.get(ActivityLogService).deleteActivityLog(activityLogId);

    res.status(200).json();
  },
);

export default router;
