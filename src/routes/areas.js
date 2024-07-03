import { Router } from "express";
import {
  createArea,
  getAreaById,
  getAreasAll,
  getDownloadArea,
  removeStateArea,
  updateArea
} from "../controllers/areas.js";
import {
  handleValidationErrors,
  validateAreaAll,
  validateAreaById,
  validateAreaState,
  validateCreateArea,
  validateUpdateArea
} from "../middleware/areas.js";
import { hasType } from "../services/permission.js";
import { ensureJWTAuth } from "../services/jwt.js";

const routerAreas = Router();

routerAreas.post(
  "/createArea",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateArea,
  handleValidationErrors,
  createArea
);

routerAreas.post(
  "/getAreasAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  validateAreaAll,
  handleValidationErrors,
  getAreasAll
);

routerAreas.get(
  "/getAreaById/:idArea",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  validateAreaById,
  handleValidationErrors,
  getAreaById
);

routerAreas.get(
  "/removeStateArea/:idArea",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateAreaById,
  handleValidationErrors,
  removeStateArea
);

routerAreas.patch(
  "/updateArea/:idArea",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateAreaById,
  validateUpdateArea,
  handleValidationErrors,
  updateArea
);

routerAreas.get(
  "/getDownoload/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  validateAreaState,
  handleValidationErrors,
  getDownloadArea
);

export default routerAreas;
