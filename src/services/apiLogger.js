import { transports as _transports, createLogger } from 'winston';
import { format } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { config } from '../../config.js';

const ENVIRONMENT = config.ENVIRONMENT;

const logDir = 'logs';
// Create the log directory if it does not exist
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
      filename: './logs/api.log'
    })
  ]
} else {
  var transports = [
    new(_transports.Console)({
      timestamp: tsFormat,
      colorize: true
    }),
    new(_transports.File)({
      filename: './logs/api.log'
    })
  ]
}


export const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: transports
});