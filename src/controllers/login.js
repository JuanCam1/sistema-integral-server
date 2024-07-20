import { matchedData } from "express-validator";
import bcrypt from "bcryptjs";

import { createToken } from "../services/jwt.js";
import { sendErrorResponse } from "../utils/sendResponse.js";
import { logger } from "../services/apilogger.js";
import { loggerAdmin } from "../services/adminLogger.js";
import { getByEmail } from "../models/login.js";

export const login = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const data = matchedData(req);

  try {
    const [[[user]]] = await getByEmail(data.email_user);

    if (!user) return sendErrorResponse(res, 500, 301, "Error in database");

    if (user.state_user == 0) return sendErrorResponse(res, 401, 101, "User Inactivo");

    switch (user.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 106, "User not found");
      case -3:
        return sendErrorResponse(res, 404, 301, "Error in database");
    }

    const checkPassword = bcrypt.compareSync(data.password_user, user.password_user);

    if (!checkPassword) {
      return sendErrorResponse(res, 401, 106, "Datos incorrectos");
    }

    if (user.profile_user === "Administrador") {
      loggerAdmin.info(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data.email_user
        )}","user":"${user.names_user}"}`
      );
    } else {
      logger.info(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data.email_user
        )}","user":"${user.names_user}"}`
      );
    }

    return res.status(200).send(JSON.stringify(createToken(user), null, 3));
  } catch (err) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data.email_user
      )}", "error":"${err}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
