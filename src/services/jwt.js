import jwt from "jsonwebtoken";
import moment from "moment";
import { config } from "../../config.js";
import { sendErrorResponse } from "../utils/sendResponse.js";

export function createToken(user) {
  //Handle payload
  const payload = {
    user_id: user.id_user,
    names_user: user.names_user,
    lastname: user.lastname,
    email_user: user.email_user,
    profile_user: user.profile_user,
    exp: moment().add(1, "days").unix()
  };
  // exp: moment().add(1, "hours").unix()

  const token = jwt.sign(payload, config.TOKEN_SECRET);

  return {
    success: true,
    data: {
      exp: payload.exp,
      token: token,
      payload: {
        user_id: user.id_user,
        names_user: user.names_user,
        lastname: user.lastname,
        email_user: user.email_user,
        profile_user: user.profile_user
      }
    }
  };
}

export function createChangePasswordToken(userId) {
  //Handle payload
  const payload = {
    id_user: userId,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix()
  };
  return jwt.sign(payload, config.TOKEN_SECRET);
}

export function createEmailConfirmationToken(userId, email) {
  //Handle payload
  const payload = {
    id_user: userId,
    email: email,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix()
  };
  return jwt.sign(payload, TOKEN_SECRET);
}

export function ensureJWTAuth(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  if (!req.headers.authorization) {
    return sendErrorResponse(res, 403, 101, "Request is missing authorization header");
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.TOKEN_SECRET);
    if (payload.exp <= moment().unix()) {
      return sendErrorResponse(res, 401, 102, "Expired token");
    } else {
      req.user = payload;
      next();
    }
  } catch (err) {
    return sendErrorResponse(res, 403, 103, `${err}`.substring(7));
  }
}

export function reAuthentificateToken(payload) {
  payload.iat = moment().unix();
  payload.exp = moment().add(1, "hours").unix();
  const token = jwt.sign(payload, TOKEN_SECRET);
  return {
    success: true,
    data: {
      exp: payload.exp,
      token: token,
      user_id: user.id_user,
      names_user: user.names_user,
      lastname: user.lastname,
      email_user: user.email_user,
      profile_user: user.profile_user
    }
  };
}

export function decodeChangePasswordToken(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  if (!req.body.password_change_token) {
    return sendErrorResponse(res, 403, 105, "Password change token is required");
  }

  const token = req.body.password_change_token.replace(/['"]+/g, "");
  try {
    const payload = jwt.verify(token, TOKEN_SECRET);
    payload.password_change_token = token;
    if (payload.exp <= moment().unix()) {
      return sendErrorResponse(res, 401, 102, "Expired token");
    }
  } catch (err) {
    return sendErrorResponse(res, 403, 103, `${err}`.substring(7));
  }
  req.change = payload;
  next();
}

export function decodeConfirmEmailToken(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  if (!req.body.email_confirmation_token) {
    return sendErrorResponse(res, 403, 105, "Email confirmation token is required");
  }
  const token = req.body.email_confirmation_token.replace(/['"]+/g, "");
  try {
    var payload = jwt.verify(token, TOKEN_SECRET);
    payload.email_confirmation_token = token;
    if (payload.exp <= moment().unix()) {
      return sendErrorResponse(res, 401, 102, "Expired token");
    }
  } catch (err) {
    return sendErrorResponse(res, 403, 103, `${err}`.substring(7));
  }
  req.confirm = payload;
  next();
}
