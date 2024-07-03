import { Router } from "express";

import { login } from "../controllers/login.js";
// import { ensureJWTAuth } from "../services/jwt.js";
import { validateUser, handleValidationErrors } from "../middleware/login.js";

const routerLogin = Router();

//LOGIN
routerLogin.post("/", validateUser, handleValidationErrors, login);

//REAUTHENTICATE
// routerLogin.get("/reauthenticate", ensureJWTAuth, reauthenticate);

export default routerLogin;
