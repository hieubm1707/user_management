import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ActivityLogService } from '../services';
import { Logger } from 'winston';

export const activityLoggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Skip logging for requests to /admin/*
  if (req.path.startsWith('/admin')) return next();

  const originalSend = res.send;
  res.send = function (body) {
    try {
      const activityLogService = Container.get(ActivityLogService);
      
      // Only log POST, PUT, DELETE requests
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        activityLogService.createActivityLog({
          description: `${req.method} ${req.path}`,
          subjectType: req.body?.model || 'Unknown',
          event: req.method.toLowerCase(),
          logType: 'auto',
          properties: {
            body: req.body,
            params: req.params,
            query: req.query,
            response: body
          }
        });
      }
    } catch (error) {
      const logger = Container.get<Logger>('logger');
      logger.error('Error logging activity:', error);
    }
    return originalSend.call(this, body);
  };
  next();
}; 