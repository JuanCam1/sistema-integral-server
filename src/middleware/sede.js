import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreateSede = [
  check("name_sede")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("address_sede")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("ubication_sede")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters")
];

export const validateUpdateSede = [
  check("idSede").exists().withMessage("Sede id is required"),
  check("id_sede").optional(),
  check("name_sede").optional(),
  check("address_sede").optional(),
  check("ubication_sede").optional()
];

export const validateSedeById = [check("idSede").exists().withMessage("Sede id is required")];

export const validateSedeState = [check("state").exists().withMessage("Sede state is required")];

export const validateSedeAll = [
  check("limit").optional().isInt({ min: 1 }).withMessage("Should be an integer greater than 0"),
  check("offset").optional().isInt({ min: 0 }).withMessage("Should be an integer"),
  check("order")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Should be an integer between 0 and 1"),
  check("order_by")
    .optional()
    .custom((value) => {
      const fields = ["name_sede,address_sede,ubication_sede"];
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

      const fields = ["name_sede,address_sede,ubication_sede"];
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
