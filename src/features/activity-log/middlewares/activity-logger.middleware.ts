import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ActivityLogService } from '../services';


import { Logger } from 'winston';


/**
 * Masks sensitive data in request/response bodies
 * Replaces password, token, and phone fields with asterisks for security
 */
const maskSensitiveData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  const masked = { ...data };
  if (masked.password) masked.password = '******';
  if (masked.token) masked.token = '******';
  if (masked.phone) masked.phone = '******';
  return masked;
};

/**
 * Middleware for automatic activity logging
 * Logs all POST, PUT, DELETE requests with user tracking and data masking
 */
export const activityLoggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Skip logging for admin panel requests to avoid duplicate logs
  if (req.path.startsWith('/admin')) return next();
  
  const originalSend = res.send;
  res.send = function (body) {
    try {
      const activityLogService = Container.get(ActivityLogService);
      
      // Only log POST, PUT, DELETE requests for activity tracking
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        // Construct full path from base URL and path segments
        const fullPath = req.baseUrl + req.path;
        
        // Determine subject type based on URL path for categorization
        let subjectType = 'Unknown';
        if (fullPath.includes('/users')) subjectType = 'User';
        else if (fullPath.includes('/salary')) subjectType = 'Salary';
        else if (fullPath.includes('/position')) subjectType = 'Position';
        else if (fullPath.includes('/positions')) subjectType = 'Position';
        else if (req.body && typeof req.body === 'object') {
          // Fallback: try to get model from request body
          subjectType = req.body.model || req.body.subjectType || 'Unknown';
        }

        const logData = {
          description: `${req.method} ${fullPath}`,
          subjectType: subjectType,
          subjectId: req.params.userId || req.body.id || req.body.userId || null,
          event: req.method.toLowerCase(),
          logType: 'auto',
          causerId: (req as any).auth?.id || null,
          causerType: (req as any).auth?.type || null,
          properties: {
            body: maskSensitiveData(req.body),
            response: maskSensitiveData(body)
          }
        };
        
        activityLogService.createActivityLog(logData);
      }
    } catch (error) {

      const logger = Container.get<Logger>('logger');
      logger.error('Error logging activity:', error);

    }
    return originalSend.call(this, body);
  };
  next();
}; 