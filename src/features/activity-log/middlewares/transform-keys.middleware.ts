/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Request, Response } from 'express';
import lodash, { camelCase } from 'lodash';

/**
 * Transforms object keys from snake_case to camelCase
 * Used for data normalization across the application
 */
const transformKeysToCamelCase = (data: object): any => {
  return lodash.mapKeys(data, (value, key) => camelCase(key));
};

/**
 * Middleware for transforming request body keys to camelCase
 * Note: Query transformation is disabled to prevent Express read-only property errors
 */
export const transformKeysMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.body = transformKeysToCamelCase(req.body);
  // req.query = transformKeysToCamelCase(req.query); // Disabled to prevent Express read-only property errors
  next();
};
