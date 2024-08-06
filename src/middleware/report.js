import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/sendResponse.js";

export const validateCreateReport = [
  check("name_report")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("normativity_report")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("type_manual_report")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("manual_report")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("signature_report")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("date_from_report")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("date_to_report")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 1 and 200 characters"),
  check("userId").exists(),
  check("areaId").exists(),
  check("platformId").exists(),
  check("entityId").exists()
];

export const validateUpdateReport = [
  check("idReport").exists(),
  check("id_report").optional(),
  check("name_report").exists(),
  check("normativity_report").exists(),
  check("type_manual_report").exists(),
  check("manual_report").exists(),
  check("signature_report").exists(),
  check("date_from_report").exists(),
  check("date_to_report").exists(),
  check("userId").exists(),
  check("areaId").exists(),
  check("platformId").exists(),
  check("entityId").exists()
];

export const validateUpdateUploadReport = [
  check("idReport").exists(),
  check("dateRegisterReport").exists(),
  check("dateShippingReport").exists(),
  check("userIdPayload").exists(),
  check("documentsReport").optional(),
  check("stateReport").exists()
];

export const validateUpdateDocumentReport = [
  check("idReport").exists(),
  check("documentsReport").optional(),
  check("dateShippingReport").optional()
];

export const validateFileNameReport = [
  check("idReport").exists(),
  check("document1").optional(),
  check("document2").optional()
];

export const validateReportById = [check("idReport").exists().withMessage("Report id is required")];

export const validateReportByIdArea = [
  check("idArea").exists().withMessage("Report id is required")
];

export const validateReportState = [
  check("state").exists().withMessage("Report state is required")
];

export const validateReportesStateByAreaId = [
  check("state").exists().withMessage("Report state is required"),
  check("areaId").exists().withMessage("area Id is required")
];

export const validateReportAll = [
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
        "name_report",
        "state_report",
        "signature_report",
        "date_from_report",
        "date_to_report",
        "name_area",
        "name_platform",
        "type_periodicity",
        "name_entity",
        "names_user"
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
        "name_report",
        "state_report",
        "signature_report",
        "date_from_report",
        "date_to_report",
        "name_area",
        "name_platform",
        "type_periodicity",
        "name_entity",
        "names_user"
      ];
      const operators = ["=", "!=", ">", "<", ">=", "<=", "LIKE"];

      if (fields.includes(value)) {
        throw new Error(`Not a valid field: ${JSON.stringify(value)}`);
      }
      if (operators.includes(value)) {
        throw new Error(`Not a valid operator: ${JSON.stringify(value)}`);
      }
      return true;
    }),
  check("state_report").optional()
];



export const validateReportAreaFechaAll = [
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
        "name_report",
        "state_report",
        "signature_report",
        "date_from_report",
        "date_to_report",
        "name_area",
        "name_platform",
        "type_periodicity",
        "name_entity",
        "names_user"
      ];
      if (!fields.includes(value)) throw new Error("Not a valid field");
      else return true;
    })
    .trim(),
  
  check("areaId").optional(),
  check("fechaInit").optional(),
  check("fechaFin").optional()
];

export const validateReportAllSinLimit = [check("state_report").optional()];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  // console.log("🚀 ~ handleValidationErrors ~ errors:", errors);

  if (!errors.isEmpty()) return sendErrorResponse(res, 400, 201, "Request has invalid data");
  next();
};
