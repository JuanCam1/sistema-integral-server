import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateUser = [
  check("email_user")
    .isLength({ min: 1, max: 100 })
    .withMessage("Must be between 1 and 100 characters")
    .isEmail()
    .withMessage("Should be a valid email")
    .trim(),
  check("password_user")
    .isLength({ min: 6, max: 80 })
    .withMessage("Must be between 6 and 80 characters")
    .trim()
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendErrorResponse(res, 400, 201, "Request has invalid data");
  next();
};
