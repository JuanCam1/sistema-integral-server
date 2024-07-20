import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreatePlatform = [
  check("name_platform")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 100 characters"),
  check("website_platform")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 100 characters"),
  check("entityId").exists().withMessage("Entity id is required"),
  check("periodicityId").exists().withMessage("Periodicity id is required"),
];

export const validateUpdatePlatform = [
  check("idPlatform").exists().withMessage("Platform id is required"),
  check("id_platform").optional(),
  check("name_platform").optional(),
  check("website_platform").optional(),
  check("entityId").optional(),
  check("periodicityId").optional()
];

export const validatePlatformById = [
  check("idPlatform").exists().withMessage("Platform id is required")
];

export const validatePlatformState = [
  check("state").exists().withMessage("Platform state is required")
];

export const validatePlatformAll = [
  check("limit").optional().isInt({ min: 1 }).withMessage("Should be an integer greater than 0"),
  check("offset").optional().isInt({ min: 0 }).withMessage("Should be an integer"),
  check("order")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Should be an integer between 0 and 1"),
  check("order_by")
    .optional()
    .custom((value) => {
      var fields = ["name_platform"];
      if (!fields.includes(value)) throw new Error("Not a valid field");
      else return true;
    })
    .trim(),
  check("filter")
    .optional()
    .custom((value) => {
      if (!value) {
        throw new Error("Filter is not a valid");
      }

      const fields = ["name_platform"];
      const operators = ["=", "!=", ">", "<", ">=", "<=", "LIKE"];

      if (fields.includes(value)) {
        throw new Error(`Not a valid field: ${JSON.stringify(value)}`);
      }
      if (operators.includes(value)) {
        throw new Error(`Not a valid operator: ${JSON.stringify(value)}`);
      }
      return true;
    })
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  // console.log("🚀 ~ handleValidationErrors ~ errors:", errors);

  if (!errors.isEmpty()) return sendErrorResponse(res, 400, 201, "Request has invalid data");
  next();
};
