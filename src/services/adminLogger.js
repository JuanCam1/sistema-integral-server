import { transports as _transports, createLogger } from 'winston';
import { format } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { config } from '../../config.js';

const ENVIRONMENT = config.ENVIRONMENT;

const logDir = 'logs';
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleString();

if (ENVIRONMENT === "development") {
  var transports = [
    new(_transports.Console)({
      timestamp: tsFormat,
      colorize: true
    }),
    new(_transports.File)({
      filename: './logs/admin.log'
    })
  ]
} else {
  var transports = [
    new(_transports.Console)({
      timestamp: tsFormat,
      colorize: true
    }),
    new(_transports.File)({
      filename: './logs/admin.log'
    })
  ]
}


export const loggerAdmin = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} : ${info.message}`)
  ),
  transports: transports
});