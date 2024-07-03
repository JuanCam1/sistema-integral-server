import nodeCleanup from "node-cleanup";
import { publicIpv4 } from "public-ip";

import app from "./src/server/server.js";
import { db } from "./db/db.js";
import { config } from "./config.js";
import { logger } from "./src/services/apilogger.js";

//Get IP
publicIpv4().then((ip) => {
  global.ip = ip;
  // Connect to MySQL on start
  db.connect((err) => {
    if (err) {
      logger.error(
        `{"message":"Cannot connect to MySQL Server from API Server at ${ip}:${config.APP_PORT}"}`
      );
      process.exit();
    } else {
      global.server = app.listen(config.APP_PORT, () => {
        logger.info(`{"message":"API Server listening at ${ip}:${config.APP_PORT}"}`);
      });
    }
  });
});

//Cleanup on exit
nodeCleanup(function (exitCode, signal) {
  if (signal) {
    global.server.close(function () {
      db.end(function (err, EndResult) {
        if (err) throw err;
        log.logger.info(
          `{"message":"Cleanup succesfull, exiting API Server at ${global.ip}:${config.APP_PORT}"}`
        );
        process.kill(process.pid, signal);
      });
    });
    nodeCleanup.uninstall();
    return false;
  }
});
