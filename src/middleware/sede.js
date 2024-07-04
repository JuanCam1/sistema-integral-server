import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreateSede = [
  check("name_sede")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("address_sede")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("flat_sede")
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
  check("flat_sede").optional(),
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
    .isLength({ min: 1, max: 255 })
    .withMessage("Must be between 1 and 255 characters")
    .custom((value) => {
      var fields = ["id_sede,name_sede,address_sede,flat_sede,ubication_sede"];
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

      const fields = ["id_sede,name_sede,address_sede,flat_sede,ubication_sede"];
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
  // console.log("🚀 ~ handleValidationErrors ~ errors:", errors);

  if (!errors.isEmpty()) return sendErrorResponse(res, 400, 201, "Request has invalid data");
  next();
};
