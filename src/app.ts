import filterRoutes from './features/filter/routes';
import authRoutes from './features/auth/routes';
import 'reflect-metadata';
import AdminJSExpress from '@adminjs/express';
import bodyParser from 'body-parser';
import compression from 'compression';
import connectSequelize from 'connect-session-sequelize';
import cors from 'cors';
import express, { Application, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import session, { SessionOptions } from 'express-session';
import statusMonitor from 'express-status-monitor';
import helmet from 'helmet';
import { NotFound, TooManyRequests } from 'http-errors';
import { i18n as I18n } from 'i18next';
import i18nHttpMiddleware from 'i18next-http-middleware';
import { join } from 'path';
import { Sequelize } from 'sequelize';
import favicon from 'serve-favicon';
import { Container } from 'typedi';
import setupAdminJs, { authenticateAdmin } from './admin';
import { Config } from './config';
import router from './controllers';
import {
  celebrateErrorHandler,
  errorHandler,
  jwtErrorHandler,
  logRequestResponse,
  sequelizeErrorHandler,
} from './middlewares';
import { SessionModel } from './models';
// app.use(activityLoggerMiddleware); // Auto logging middleware disabled

/**
 * Method used to setup middlewares and routing for the `app` instance.
 */
export default function initializeApp(app: Application) {
  const config = Container.get<Config>('config');
  const i18n = Container.get<I18n>('i18n');
  const sequelize = Container.get<Sequelize>('sequelize');

  app.enable('trust proxy');
  app.use(bodyParser.json());
  app.use(compression() as unknown as RequestHandler);
  app.use(cors());
  app.use(favicon(join(config.publicPath, 'favicon.ico')) as unknown as RequestHandler);

  app.use(logRequestResponse);
  // app.use(activityLoggerMiddleware); // Auto logging middleware disabled

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  // Rate limiting configuration
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: i18n.t('errors:tooManyRequests'),
      statusCode: new TooManyRequests().statusCode,
      skip: () => !(config.env === 'production'),
    }) as unknown as RequestHandler,
  );

  // Status monitoring configuration
  app.use(
    statusMonitor({
      path: '/status',
      title: 'voucher rest api | Monitoring',
      websocket: Container.get<SocketIO.Server>('socket'),
    }) as unknown as RequestHandler,
  );

  // Session store configuration
  const SequelizeStore = connectSequelize(session.Store);
  const store = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000, // Remove expired session every 15 minutes
    expiration: 24 * 60 * 60 * 1000, // Set session expiry time to 24 hours
    tableName: SessionModel.options.tableName,
  });

  // AdminJS panel configuration
  const adminJs = setupAdminJs(sequelize);

  const sessionOptions: SessionOptions = {
    cookie: {
      httpOnly: true,
      secure: config.env === 'production',
    },
    name: 'adminjs',
    resave: true,
    saveUninitialized: true,
    secret: config.jwt.secret,
    store,
  };

   const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
     adminJs,
     {
       authenticate: authenticateAdmin,
      cookieName: sessionOptions.name,
       cookiePassword: sessionOptions.secret as string,
     },
     null,
     sessionOptions,
   );

   app.use(adminJs.options.rootPath, adminRouter);

  // i18n middleware configuration
  app.use(i18nHttpMiddleware.handle(i18n));
  app.use((req, res, next) => {
    if (req.i18n) {
      Container.set('i18n', req.i18n);
    }

    next();
  });

  // API documentation
  app.use('/doc', express.static(join(config.publicPath, '/doc')));

  // Public assets
  app.use('/public', express.static(config.publicPath));

  // Mount password change router
  app.use('/auth', authRoutes);

  //routing filter
  app.use('/filter', filterRoutes);

  // Routing configuration
  app.use(router);

  // 404 error handling
  app.use((req, res, next) => {
    const { baseUrl, url, method } = req;

    next(new NotFound(req.i18n.t('errors:routeNotFound', { method, baseUrl, url })));
  });

  // Error handling
  app.use(jwtErrorHandler());
  app.use(celebrateErrorHandler());
  app.use(sequelizeErrorHandler());
  app.use(errorHandler());
}
