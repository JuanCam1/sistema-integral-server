import auth from "basic-auth";
import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from "../config";

export function ensureBasicAuth(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  if (!req.headers.authorization) {
    return res.status(403).send(
      JSON.stringify(
        {
          success: false,
          error: {
            code: 101,
            message: "Request is missing authorization header",
            details: null
          }
        },
        null,
        3
      )
    );
  }

  const credentials = auth(req);
  if (
    !credentials ||
    credentials.name !== BASIC_AUTH_USER ||
    credentials.pass !== BASIC_AUTH_PASSWORD
  ) {
    res.setHeader("WWW-Authenticate", 'Basic realm="asiconnect"');
    return res.status(403).send(
      JSON.stringify(
        {
          success: false,
          error: {
            code: 104,
            message: "Invalid credentials",
            details: null
          }
        },
        null,
        3
      )
    );
  }
  next();
}
