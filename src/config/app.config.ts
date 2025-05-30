import convict from 'convict';
import dotenv from 'dotenv';
import moment from 'moment';
import { resolve } from 'path';
import 'moment/min/locales';

type NodeEnv = 'development' | 'staging' | 'production';

/**
 * Load environment variables
 */
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}`,
});

/**
 * Configure moment
 */
moment.locale('en');

/**
 * Configure error stack trace limit
 */
Error.stackTraceLimit = 10;

const configSchema = convict({
  /**
   * Server config
   */
  env: {
    doc: 'Application environment',
    format: ['development', 'staging', 'production'],
    env: 'NODE_ENV',
    default: 'development' as NodeEnv,
  },
  port: {
    doc: 'Server port',
    format: 'port',
    env: 'PORT',
    default: 8080,
  },

  /**
   * Environment config
   */
  debug: {
    doc: 'Debug mode',
    format: Boolean,
    env: 'DEBUG',
    default: false,
  },
  publicHost: {
    doc: 'Public host of the server',
    format: 'url',
    env: 'PUBLIC_HOST',
    default: 'http://localhost:8080',
  },
  version: {
    doc: 'Package version',
    format: String,
    env: 'npm_package_version',
    default: '',
  },

  /**
   * Application config
   */
  logsDir: {
    doc: 'Application logs directory',
    format: String,
    default: resolve(process.cwd(), './logs'),
  },
  publicPath: {
    doc: 'Public assets path',
    format: String,
    default: resolve(process.cwd(), './public'),
  },

  /**
   * Database config
   */
  db: {
    host: {
      doc: 'Database host name / IP',
      format: String,
      env: 'DB_HOST',
      default: 'localhost',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      env: 'DB_PORT',
      default: 5432,
    },
    username: {
      doc: 'Database username',
      format: String,
      env: 'DB_USER',
      default: '',
    },
    password: {
      doc: 'Database password',
      format: String,
      env: 'DB_PASSWORD',
      default: '',
    },
    database: {
      doc: 'Database name',
      format: String,
      env: 'DB_NAME',
      default: '',
    },
  },

  /**
   * Redis config
   */
  redis: {
    host: {
      doc: 'Redis host',
      format: String,
      env: 'REDIS_HOST',
      default: '',
    },
    port: {
      doc: 'Redis port',
      format: 'port',
      env: 'REDIS_PORT',
      default: 6379,
    },
  },

  /**
   * JWT config
   */
  jwt: {
    secret: {
      doc: 'JWT secret',
      format: String,
      env: 'JWT_SECRET',
      sensitive: true,
      default: '',
    },
  },

  /**
   * SMTP config
   */
  smtp: {
    host: {
      doc: 'SMTP host',
      format: String,
      env: 'SMTP_HOST',
      default: '',
    },
    port: {
      doc: 'SMTP port',
      format: 'port',
      env: 'SMTP_PORT',
      default: 465,
    },
    user: {
      doc: 'SMTP user',
      format: String,
      env: 'SMTP_USER',
      default: '',
    },
    password: {
      doc: 'SMTP password',
      format: String,
      env: 'SMTP_PASSWORD',
      default: '',
    },
  },
});

// Validate current config
configSchema.validate({ allowed: 'strict' });

export const config = configSchema.getProperties();

export type Config = typeof config;
