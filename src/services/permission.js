import { sendErrorResponse } from "../utils/sendResponse.js";

export const hasType = (types) => {
  return function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    const dataHeader = req.header("X-User-Data");
    const payload = JSON.parse(dataHeader);

    if (Object.values(payload).includes("")) {
      return sendErrorResponse(res, 403, 107, "Error in authentification 2");
    }

    if (!types.includes(payload.profilePayload)) {
      return sendErrorResponse(res, 401, 105, "User is not authorized to perform this action");
    }
    next();
  };
};
