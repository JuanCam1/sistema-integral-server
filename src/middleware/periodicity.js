import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreatePeriodicity = [
  check("type_periodicity")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters")
];

export const validateUpdatePeriodicity = [
  check("idPeriodicity").exists().withMessage("Periodicity id is required"),
  check("id_periodicity").optional(),
  check("type_periodicity").optional()
];

export const validatePeriodicityById = [check("idPeriodicity").exists().withMessage("Periodicity id is required")];

export const validatePeriodicityAll = [
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
      const fields = ["id_periodicity,type_periodicity"];
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

      const fields = ["id_periodicity,type_periodicity"];
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
