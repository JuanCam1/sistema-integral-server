import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreateEntity = [
  check("name_entity")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("address_entity")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("phone_entity")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("email_entity")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
];

export const validateUpdateEntity = [
  check("idEntity").exists().withMessage("Entity id is required"),
  check("id_entity").optional(),
  check("name_entity").optional(),
  check("address_entity").optional(),
  check("phone_entity").optional(),
  check("email_entity").optional()
];

export const validateEntityById = [check("idEntity").exists().withMessage("Entity id is required")];

export const validateEntityState = [
  check("state").exists().withMessage("Entity state is required")
];

export const validateEntityAll = [
  check("limit").optional().isInt({ min: 1 }).withMessage("Should be an integer greater than 0"),
  check("offset").optional().isInt({ min: 0 }).withMessage("Should be an integer"),
  check("order")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Should be an integer between 0 and 1"),
  check("order_by")
    .optional()
    .custom((value) => {
      const fields = ["name_entity,email_entity"];
      if (!fields.includes(value)) throw new Error("Not a valid field");
      else return true;
    })
    .trim(),
  check("filter")
    .optional()
    .custom((value) => {
      if (!value) {
        throw new Error("Filter is not a valid ");
      }
      const fields = ["name_entity,email_entity"];
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
