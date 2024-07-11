import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreateUser = [
  check("cedula_user")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("names_user")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("lastnames")
    .isLength({ min: 3, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("phone_user")
    .isLength({ min: 4, max: 80 })
    .withMessage("Must be between 1 and 80 characters"),
  check("email_user").isEmail().withMessage("Email no valid"),
  check("password_user")
    .isLength({ min: 1, max: 20 })
    .withMessage("Must be between 1 and 20 characters"),
  check("position_user")
    .isLength({ min: 1, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("profile_user")
    .isLength({ min: 1, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("photo_user").optional(),
  check("areaId").optional()
];

export const validateUpdateUser = [
  check("cedula_user").optional(),
  check("names_user").optional(),
  check("lastnames").optional(),
  check("phone_user").optional(),
  check("email_user").optional(),
  check("password_user").optional(),
  check("position_user").optional(),
  check("profile_user").optional(),
  check("photo_user").optional(),
  check("areaId").optional()
];

export const validateFileNameImage = [
  check("fileName").exists().withMessage("File name is required")
];
export const validateUserById = [check("idUser").exists().withMessage("User id is required")];

export const validateUserState = [check("state").exists().withMessage("User state is required")];

export const validateUserAll = [
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
        "cedula_user",
        "names_user",
        "lastnames",
        "email_user",
        "profile_user",
        "name_area",
        "position_user"
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

      const fields = [
        "cedula_user",
        "names_user",
        "lastnames",
        "email_user",
        "profile_user",
        "name_area",
        "position_user"
      ];
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
