import { Router } from "express";
import {
  createPlatform,
  getPlatformById,
  getPlatformsAll,
  getDownloadPlatform,
  removeStatePlatform,
  updatePlatform
} from "../controllers/platform.js";
import {
  handleValidationErrors,
  validatePlatformAll,
  validatePlatformById,
  validatePlatformState,
  validateCreatePlatform,
  validateUpdatePlatform
} from "../middleware/platform.js";
import { hasType } from "../services/permission.js";
import { ensureJWTAuth } from "../services/jwt.js";

const routerPlatforms = Router();

routerPlatforms.post(
  "/createPlatform",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreatePlatform,
  handleValidationErrors,
  createPlatform
);

routerPlatforms.post(
  "/getPlatformAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validatePlatformAll,
  handleValidationErrors,
  getPlatformsAll
);

routerPlatforms.get(
  "/getPlatformById/:idPlatform",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validatePlatformById,
  handleValidationErrors,
  getPlatformById
);

routerPlatforms.get(
  "/removeStatePlatform/:idPlatform",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validatePlatformById,
  handleValidationErrors,
  removeStatePlatform
);

routerPlatforms.patch(
  "/updatePlatform/:idPlatform",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validatePlatformById,
  validateUpdatePlatform,
  handleValidationErrors,
  updatePlatform
);

routerPlatforms.get(
  "/getDownload/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validatePlatformState,
  handleValidationErrors,
  getDownloadPlatform
);

export default routerPlatforms;
