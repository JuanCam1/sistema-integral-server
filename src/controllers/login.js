import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";

import { createToken } from "../services/jwt.js";
import { sendErrorResponse } from "../utils/sendResponse.js";
import { logger } from "../services/apilogger.js";
import { getByEmail } from "../models/login.js";

export const login = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
   
    //Get matched data
    const data = matchedData(req);

    //Get user information
    const [[[user]]] = await getByEmail(data.email_user);

    if (!user) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (user) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "User not found");
      case -3:
        return sendErrorResponse(
          res,
          404,
          467,
          "Email not confirmed yet, please, verify your email inbox."
        );
    }

    //Compare access
    // var checkPassword = bcrypt.compareSync(data.password_user, User.password_user);

    return res.status(200).send(JSON.stringify(createToken(user), null, 3));
    // if (checkPassword) {
    // } else {
    //   return sendErrorResponse(res, 401, 106, "Wrong access");
    // }
  } catch (err) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(req.body)}","user":"${
        req.names_user
      }", "error":"${err}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

//TODO: Faltante
// export const reauthenticate = (req, res) => {
//   try {
//     res.setHeader("Content-Type", "application/json");
//     logger.info(
//       `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "body":"${JSON.stringify(
//         req.body
//       )}","user":"${req.user.user_id}"}`
//     );
//     //Create new Token
//     return res.status(200).send(JSON.stringify(reAuthentificateToken(req.user), null, 3));
//   } catch (err) {
//     logger.error(
//       `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
//         req.params
//       )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(req.body)}","user":"${
//         req.user.user_id
//       }", "error":"${err}"}`
//     );
//     return res.status(500).send(
//       JSON.stringify(
//         {
//           success: false,
//           error: { code: 301, message: "Error in service or database", details: err }
//         },
//         null,
//         3
//       )
//     );
//   }
// };
