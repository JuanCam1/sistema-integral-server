import { sendErrorResponse } from "../utils/sendResponse.js";

export const hasType = (types) => {
  return function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    const dataHeader = req.header("X-User-Data");
    const payload = JSON.parse(dataHeader);
    // console.log("🚀 ~ permission ~ req:", JSON.parse(payload));

    if (!payload) {
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }

    // if (req.body.payload.profile_user !== type) {
    if (!types.includes(payload.profile_user)) {
      return sendErrorResponse(res, 401, 105, "User is not authorized to perform this action");
    }
    next();
  };
};
