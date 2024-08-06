import { Router } from "express";
import {
  createEntity,
  getDownloadEntity,
  getEntityAll,
  getEntityById,
  removeStateEntity,
  updateEntity
} from "../controllers/entity.js";
import {
  handleValidationErrors,
  validateCreateEntity,
  validateEntityAll,
  validateEntityById,
  validateEntityState,
  validateUpdateEntity
} from "../middleware/entity.js";
import { hasType } from "../services/permission.js";
import { ensureJWTAuth } from "../services/jwt.js";

const routerEntity = Router();

routerEntity.post(
  "/createEntity",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateEntity,
  handleValidationErrors,
  createEntity
);

routerEntity.post(
  "/getEntityAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateEntityAll,
  handleValidationErrors,
  getEntityAll
);

routerEntity.get(
  "/getEntityById/:idEntity",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateEntityById,
  handleValidationErrors,
  getEntityById
);

routerEntity.get(
  "/removeStateEntity/:idEntity",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEntityById,
  handleValidationErrors,
  removeStateEntity
);

routerEntity.patch(
  "/updateEntity/:idEntity",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEntityById,
  validateUpdateEntity,
  handleValidationErrors,
  updateEntity
);

routerEntity.get(
  "/getDownload/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateEntityState,
  handleValidationErrors,
  getDownloadEntity
);


export default routerEntity;
