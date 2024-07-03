// export const validatePayload = [
//   body("payload").custom((payload) => {
//     if (!payload) {
//       throw new Error("Payload is required");
//     }

//     // Check individual fields within payload
//     const { user_id, names_user, email_user, profile_user } = payload;

//     if (!user_id || !/^\d+$/.test(user_id)) {
//       throw new Error("Valid user_id is required");
//     }
//     if (!names_user || typeof names_user !== "string" || names_user.length < 1) {
//       throw new Error("Valid names_user is required");
//     }
//     if (!email_user || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_user)) {
//       throw new Error("Valid email_user is required");
//     }
//     if (!profile_user || typeof profile_user !== "string" || profile_user.length < 1) {
//       throw new Error("Valid profile_user is required");
//     }

//     return true;
//   })
// ];

export function validatePayload(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  
  console.log("🚀 ~ validatePayload ~ req:", req.header("X-User-Data"));
  //TODO: payload si llega falta conversion a objeto de js
  if (!req.header("X-User-Data")) {
    return sendErrorResponse(res, 403, 101, "Request is missing authorization header");
  }
  // const { user_id, names_user, email_user, profile_user } = req.header("X-User-Data");
  // const token = req.headers.authorization.split(" ")[1];

  // try {
  //   const payload = jwt.verify(token, config.TOKEN_SECRET);
  //   if (payload.exp <= moment().unix()) {
  //     return sendErrorResponse(res, 401, 102, "Expired token");
  //   } else {
  //     req.user = payload;
  //     next();
  // }
  // } catch (err) {
  //   return sendErrorResponse(res, 403, 103, `${err}`.substring(7));
  // }
}
