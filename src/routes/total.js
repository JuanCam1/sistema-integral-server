import { Router } from "express";
import { ensureJWTAuth } from "../services/jwt.js";
import { hasType } from "../services/permission.js";
import { getAreasTotal, getEntitiesTotal, getPeriodicitiesTotal, getPlatformsTotal, getSedeTotal, getUsersByIdArea, getUsersTotal } from "../controllers/total.js";
import { handleValidationErrors, validateAreaById } from "../middleware/areas.js";

const routerTotal = Router();

routerTotal.get(
  "/getAreasTotal",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  getAreasTotal
);

routerTotal.get(
  "/getEntitiesTotal",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  getEntitiesTotal
);

routerTotal.get(
  "/getPeriodicitiesTotal",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  getPeriodicitiesTotal
);

routerTotal.get(
  "/getPlatformsTotal",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  getPlatformsTotal
);

routerTotal.get(
  "/getSedeTotal",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  getSedeTotal
);

routerTotal.get(
  "/getUsersTotal",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  getUsersTotal
);

routerTotal.get(
  "/getUsersByIdArea/:idArea",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateAreaById,
  handleValidationErrors,
  getUsersByIdArea
);

export default routerTotal;