import { Router } from "express";
import path from "path";
import multer from "multer";

import { ensureJWTAuth } from "../services/jwt.js";
import { hasType } from "../services/permission.js";
import {
  handleValidationErrors,
  validateReportAll,
  validateReportById,
  validateReportByIdArea,
  validateCreateReport,
  validateUpdateReport,
  validateReportState,
  validateUpdateUploadReport,
  validateReportAllSinLimit,
  validateFileNameReport,
  validateUpdateDocumentReport,
  validateReportAreaFechaAll,
  validateReportesStateByAreaId
} from "../middleware/report.js";
import {
  getReportById,
  getReportsAll,
  getReportByIdArea,
  createReport,
  updateReport,
  removeStateReport,
  getDownloadReport,
  getReportsAllUser,
  updateUploadReport,
  getReportsAllSinLimitUser,
  getDocuments,
  updateDocumentReport,
  reportesAllState,
  getReportsAllAreaFecha,
  getReportsAllAreaNoEnviado,
  reportesStateByAreaId
} from "../controllers/report.js";

const storageDocuments = multer.diskStorage({
  destination: "uploads/reports",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storageDocuments,
  fileFilter: (req, file, cb) => {
    const fileTypes = /png|jpeg|jpg|pdf|txt|xls|xlsx|csv|doc|docx|gif|bmp|tiff|svg|webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Only document are allowed (png|jpeg|jpg|pdf|txt|xls|xlsx|csv|doc|docx|gif|bmp|tiff|svg|webp)"
        )
      );
    }
  }
});

const routerReport = Router();

routerReport.post(
  "/createReport",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateReport,
  handleValidationErrors,
  createReport
);

routerReport.patch(
  "/updateReport/:idReport",
  ensureJWTAuth,
  hasType(["Administrador", "Funcionario"]),
  validateReportById,
  validateUpdateReport,
  handleValidationErrors,
  updateReport
);

routerReport.patch(
  "/updateUploadReport/:idReport",
  ensureJWTAuth,
  hasType(["Funcionario"]),
  upload.array("documentsReport",2),
  validateReportById,
  validateUpdateUploadReport,
  handleValidationErrors,
  updateUploadReport
);

routerReport.patch(
  "/updateDocumentReport/:idReport",
  ensureJWTAuth,
  hasType(["Funcionario"]),
  upload.array("documentsReport",2),
  validateReportById,
  validateUpdateDocumentReport,
  handleValidationErrors,
  updateDocumentReport
);

routerReport.post(
  "/getReportsAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  validateReportAll,
  handleValidationErrors,
  getReportsAll
);

routerReport.post(
  "/getReportsAllUser",
  ensureJWTAuth,
  hasType(["Funcionario"]),
  validateReportAll,
  handleValidationErrors,
  getReportsAllUser
);

routerReport.post(
  "/getReportsAllAreaFecha",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateReportAreaFechaAll,
  handleValidationErrors,
  getReportsAllAreaFecha
);

routerReport.post(
  "/getReportsAllAreaNoEnviado",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateReportAreaFechaAll,
  handleValidationErrors,
  getReportsAllAreaNoEnviado
);

routerReport.post(
  "/getReportsAllSinLimitUser",
  ensureJWTAuth,
  hasType(["Funcionario"]),
  validateReportAllSinLimit,
  handleValidationErrors,
  getReportsAllSinLimitUser
);

routerReport.post(
  "/getDocuments",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  validateFileNameReport,
  handleValidationErrors,
  getDocuments
);

routerReport.get(
  "/removeStateReport/:idReport",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateReportById,
  handleValidationErrors,
  removeStateReport
);

routerReport.get(
  "/getReportByIdArea/:idArea",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  validateReportByIdArea,
  handleValidationErrors,
  getReportByIdArea
);

routerReport.get(
  "/getReportById/:idReport",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  validateReportById,
  handleValidationErrors,
  getReportById
);

routerReport.get(
  "/getDownloadReport/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  validateReportState,
  handleValidationErrors,
  getDownloadReport
);

routerReport.get(
  "/getReportesAllState",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  reportesAllState
);

routerReport.post(
  "/reportesStateByAreaId",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateReportesStateByAreaId,
  handleValidationErrors,
  reportesStateByAreaId
);

export default routerReport;
