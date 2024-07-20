import { getScheduleModel } from "../models/schedule.js";
import { logger } from "../services/apilogger.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";

export const getSchedule = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const [[schedules]] = await getScheduleModel();

    if (!schedules) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (schedules.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "schedules no exist");
    }

    return sendSuccesResponse(res, 200, {
      schedules
    });
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data.email_user
      )}", "error":"${error}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
