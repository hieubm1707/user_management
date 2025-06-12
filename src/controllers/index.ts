import Router from 'express-promise-router';
import morgan from 'morgan';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { activityLogController } from '../features/activity-log';
import { auth } from '../middlewares';
import authController from './auth.controller';
import healthController from './health.controller';
import usersController from './users.controller';
import salaryController from './salary.controller';
import positionRouter from './position.controller';

import { RequestHandler } from 'express';
// add new controller here

const router = Router();

/**
 * HTTP request logging configuration
 */
router.use(
  morgan('dev', {
    stream: {
      write: message => {
        const logger = Container.get<Logger>('logger');

        logger.info(message.trim());
      },
    },
  }),
);

/**
 * API routes
 */
router.use('/auth', authController);
router.use('/health', healthController);
router.use('/users', auth.required as unknown as RequestHandler, usersController);
router.use('/activity-log', activityLogController);
router.use('/salary', salaryController);
router.use('/positions', positionRouter);


export default router;
