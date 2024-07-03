import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreateArea = [
  check("name_area")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 100 characters"),
  check("sede_area")
    .isLength({ min: 3, max: 100 })
    .withMessage("Must be between 1 and 100 characters"),
  check("address_area")
    .isLength({ min: 4, max: 100 })
    .withMessage("Must be between 1 and 100 characters"),
  check("flat_area")
    .isLength({ min: 1, max: 50 })
    .withMessage("Must be between 1 and 100 characters"),
  check("phone_area")
    .isLength({ min: 4, max: 50 })
    .withMessage("Must be between 1 and 100 characters"),
  check("extension_area")
    .isLength({ min: 1, max: 20 })
    .withMessage("Must be between 1 and 100 characters")
];

export const validateUpdateArea = [
  check("id_area")
  .optional(),
  check("name_area")
    .optional(),
  check("sede_area")
    .optional(),
  check("address_area")
    .optional(),
  check("flat_area")
    .optional(),
  check("phone_area")
    .optional(),
  check("extension_area")
    .optional(),
];

export const validateAreaById = [
  check("idArea")
    .exists()
    .withMessage("Area id is required")
];

export const validateAreaState = [
  check("state")
    .exists()
    .withMessage("Area state is required")
];

export const validateAreaAll = [
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
      var fields = [
        "id_area",
        "name_area",
        "sede_area",
        "address_area",
        "flat_area",
        "phone_area",
        "extension_area"
      ];
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

      var fields = [
        "id_area",
        "name_area",
        "sede_area",
        "address_area",
        "flat_area",
        "phone_area",
        "extension_area"
      ];
      var operators = ["=", "!=", ">", "<", ">=", "<=", "LIKE"];
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
