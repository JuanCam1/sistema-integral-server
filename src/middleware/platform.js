import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreatePlatform = [
  check("name_platform")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 100 characters")
];

export const validateUpdatePlatform = [
  check("idPlatform").exists().withMessage("Platform id is required"),
  check("id_platform").optional(),
  check("name_platform").optional()
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
    .isLength({ min: 1, max: 255 })
    .withMessage("Must be between 1 and 255 characters")
    .custom((value) => {
      var fields = ["id_platform", "name_platform"];
      if (!fields.includes(value)) throw new Error("Not a valid field");
      else return true;
    })
    .trim(),
  check("filter")
    .optional()
    .custom((value) => {
      if (!value) {
        throw new Error("Filter is not a valid json");
      }

      const value_a = JSON.parse(value);

      const fields = ["id_platform", "name_platform"];
      const operators = ["=", "!=", ">", "<", ">=", "<=", "LIKE"];
      if (!(value_a instanceof Array)) throw new Error("Filter should be an array");
      value_a.forEach((element) => {
        if (
          element.field === undefined ||
          element.operator === undefined ||
          element.value === undefined
        )
          throw new Error(`Not a valid filter: ${JSON.stringify(element)}`);
        if (!fields.includes(element.field))
          throw new Error(`Not a valid field: ${JSON.stringify(element)}`);
        if (!operators.includes(element.operator))
          throw new Error(`Not a valid operator: ${JSON.stringify(element)}`);
      });
      return true;
    })
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  console.log("🚀 ~ handleValidationErrors ~ errors:", errors);

  if (!errors.isEmpty()) return sendErrorResponse(res, 400, 201, "Request has invalid data");
  next();
};
