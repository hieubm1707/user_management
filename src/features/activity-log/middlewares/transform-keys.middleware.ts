/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Request, Response } from 'express';
import lodash, { camelCase } from 'lodash';

const transformKeysToCamelCase = (data: object): any => {
  return lodash.mapKeys(data, (value, key) => camelCase(key));
};

export const transformKeysMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.body = transformKeysToCamelCase(req.body);
  req.query = transformKeysToCamelCase(req.query);
  next();
};
