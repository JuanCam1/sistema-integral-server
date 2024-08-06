import { Router } from "express";
import {
  createSede,
  getDownloadSede,
  getSedeAll,
  getSedeById,
  removeStateSede,
  updateSede
} from "../controllers/sede.js";
import {
  handleValidationErrors,
  validateCreateSede,
  validateSedeAll,
  validateSedeById,
  validateSedeState,
  validateUpdateSede
} from "../middleware/sede.js";
import { hasType } from "../services/permission.js";
import { ensureJWTAuth } from "../services/jwt.js";

const routerSede = Router();

routerSede.post(
  "/createSede",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateSede,
  handleValidationErrors,
  createSede
);

routerSede.post(
  "/getSedeAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateSedeAll,
  handleValidationErrors,
  getSedeAll
);

routerSede.get(
  "/getSedeById/:idSede",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateSedeById,
  handleValidationErrors,
  getSedeById
);

routerSede.get(
  "/removeStateSede/:idSede",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateSedeById,
  handleValidationErrors,
  removeStateSede
);

routerSede.patch(
  "/updateSede/:idSede",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateSedeById,
  validateUpdateSede,
  handleValidationErrors,
  updateSede
);

routerSede.get(
  "/getDownload/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateSedeState,
  handleValidationErrors,
  getDownloadSede
);

export default routerSede;
