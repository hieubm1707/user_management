import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import jwt, { UnauthorizedError } from 'express-jwt';
import createHttpError from 'http-errors';
import { i18n as I18n } from 'i18next';
import { Container } from 'typedi';
import { UserModel } from '../models';
import { AuthUser, DecodedJWT } from '../types';
import { getJwtSecret } from '../utils';

const secretCallback = (
  req: Request,
  payload: DecodedJWT,
  done: (err: any, secret: string) => void,
): void | Promise<void> => {
  const i18n = Container.get<I18n>('i18n');
  const message = i18n.t('errors:invalidAuthentication');

  if (!payload || !payload.sub) {
    return done(new UnauthorizedError('invalid_token', { message }), '');
  }

  const { sub: userId } = payload;

  return UserModel.findByPk(userId, {
    attributes: ['id', 'email', 'username', 'password', 'role', 'positionId', 'firstName', 'lastName', 'phone','positionId'],
    include: ['position']
  })
    .then(user => {
      if (!user) {
        return done(new UnauthorizedError('invalid_token', { message }), '');
      }

      const { password, ...authUser } = user.get({ plain: true }) as AuthUser & {
        password: string;
      };

      (req as any).userData = authUser as AuthUser;

      const secret = getJwtSecret(user.password);

      return done(null, secret);
    })
    .catch((err: any) => done(err, ''));
};

export const auth = {
  required: jwt({
    algorithms: ['HS256'],
    secret: secretCallback as any,
    requestProperty: 'jwt',
  }),
  optional: jwt({
    algorithms: ['HS256'],
    secret: secretCallback as any,
    credentialsRequired: false,
    requestProperty: 'jwt',
  }),
};

export const jwtErrorHandler = (): ErrorRequestHandler => {
  const i18n = Container.get<I18n>('i18n');

  return (err, req, res, next) => {
    if (err instanceof UnauthorizedError) {
      const message = i18n.t('errors:invalidAuthentication');
      return next(createHttpError(401, err, { message }));
    }

    return next(err);
  };
};

export const assignUserToAuth = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).userData) {
    req.auth = (req as any).userData;
  }
  next();
};