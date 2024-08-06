import { Router } from "express";
import {
  createPeriodicity,
  getDownloadPeriodicity,
  getPeriodicityAll,
  getPeriodicityById,
  updatePeriodicity,
} from "../controllers/periodicity.js";
import {
  handleValidationErrors,
  validateCreatePeriodicity,
  validatePeriodicityAll,
  validatePeriodicityById,
  validateUpdatePeriodicity
} from "../middleware/periodicity.js";
import { hasType } from "../services/permission.js";
import { ensureJWTAuth } from "../services/jwt.js";

const routerPeriodicity = Router();

routerPeriodicity.post(
  "/createPeriodicity",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreatePeriodicity,
  handleValidationErrors,
  createPeriodicity
);

routerPeriodicity.post(
  "/getPeriodicityAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validatePeriodicityAll,
  handleValidationErrors,
  getPeriodicityAll
);

routerPeriodicity.get(
  "/getPeriodicityById/:idPeriodicity",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validatePeriodicityById,
  handleValidationErrors,
  getPeriodicityById
);

routerPeriodicity.patch(
  "/updatePeriodicity/:idPeriodicity",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validatePeriodicityById,
  validateUpdatePeriodicity,
  handleValidationErrors,
  updatePeriodicity
);

routerPeriodicity.get(
  "/getDownload",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  getDownloadPeriodicity
);


export default routerPeriodicity;
