import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreateArea = [
  check("name_area")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("phone_area")
    .isLength({ min: 3, max: 80 })
    .withMessage("Must be between 1 and 80 characters"),
  check("flat_area")
    .optional()
    .isLength({ min: 4, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("extension_area")
    .optional()
    .isLength({ min: 1, max: 45 })
    .withMessage("Must be between 1 and 45 characters"),
  check("sedeId").isLength({ min: 1, max: 45 }).withMessage("Must be between 1 and 45 characters")
];

export const validateUpdateArea = [
  check("id_area").optional(),
  check("name_area").optional(),
  check("phone_area").optional(),
  check("extension_area").optional(),
  check("flat_area").optional(),
  check("sedeId").optional()
];

export const validateAreaById = [check("idArea").exists().withMessage("Area id is required")];

export const validateAreaState = [check("state").exists().withMessage("Area state is required")];

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
      const fields = [
        "id_area",
        "name_area",
        "flat_area",
        "phone_area",
        "extension_area",
        "name_sede"
      ];
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

      const fields = ["name_area", "name_sede", "ubication_sede"];
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
