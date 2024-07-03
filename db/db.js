import { createPool } from 'mysql2';
import { config } from '../config.js';

const state = {
  pool: null,
  mode: null,
}

const ENVIRONMENT = config.ENVIRONMENT;
const DB_HOST = config.DB_HOST;
const DB_USER = config.DB_USER;
const DB_PASSWORD = config.DB_PASSWORD;
const DEVELOPMENT_DB = config.DEVELOPMENT_DB;
const APP_PORT_DB = config.APP_PORT_DB;

function connect(done) {
  state.pool = createPool({
    host: DB_HOST,
    user: DB_USER, 
    port: APP_PORT_DB,
    password: DB_PASSWORD,
    database: ENVIRONMENT === "production" ? PRODUCTION_DB : DEVELOPMENT_DB,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })

  state.mode = ENVIRONMENT;
  done();
}

function get() {
  return state.pool
}

function end(cb) {
  state.pool.end(function (err) {
    if (err) {
      cb(err)
    } else {
      cb(null,1);
    }
  });
}

export const db = {
  connect,
  get,
  end
}