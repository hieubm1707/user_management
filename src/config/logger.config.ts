import { existsSync, mkdirSync } from 'fs';
import moment from 'moment';
import { createLogger, format, Logform, transports } from 'winston';
import { config } from './app.config';

const { colorize, combine, errors, printf, timestamp } = format;

const customFormat: Logform.Format = combine(
  errors({ stack: config.env === 'development' || config.debug }),
  timestamp({ format: () => moment().format('YYYY-MM-DD HH:mm:ss') }),
);

if (!existsSync(config.logsDir)) {
  mkdirSync(config.logsDir);
}

export const logger = createLogger({
  format: combine(customFormat, format.json()),
  transports: [
    new transports.Console({
      level: config.debug ? 'debug' : 'info',
      format: combine(
        colorize(),
        printf(info => {
          const log = `${info.timestamp} ${info.level}: ${info.message}`;

          return info.stack ? `${log}\n${info.stack}` : log;
        }),
      ),
    }),
    new transports.File({
      level: 'error',
      dirname: config.logsDir,
      filename: `${moment().format('YYYY-MM-DD')}-errors.log`,
      format: format.json(),
    }),
    new transports.File({
      level: 'info',
      dirname: config.logsDir,
      filename: `${moment().format('YYYY-MM-DD')}.log`,
      format: format.json(),
    }),
  ],
  exitOnError: false,
});
