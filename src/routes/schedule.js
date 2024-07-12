import { Router } from "express";
import { ensureJWTAuth } from "../services/jwt.js";
import { getSchedule } from "../controllers/schedule.js";
import { hasType } from "../services/permission.js";

const routerSchedule = Router();

routerSchedule.get(
  "/getSchedule",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  getSchedule
);

export default routerSchedule;
