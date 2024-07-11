import { Router } from "express";
import {
  createUser,
  getAreasTotal,
  getDownloadUser,
  getImage,
  getUsersAll,
  removeStateUser,
  updateUser
} from "../controllers/user.js";
import {
  handleValidationErrors,
  validateCreateUser,
  validateFileNameImage,
  validateUpdateUser,
  validateUserAll,
  validateUserById,
  validateUserState
} from "../middleware/user.js";
import { hasType } from "../services/permission.js";
import { ensureJWTAuth } from "../services/jwt.js";

import path from "path";
import multer from "multer";

const storagePhoto = multer.diskStorage({
  destination: "uploads/photos",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storagePhoto,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
    }
  }
});

const routerUsers = Router();

routerUsers.post(
  "/createUser",
  ensureJWTAuth,
  hasType(["Administrador"]),
  upload.single("photo_user"),
  validateCreateUser,
  handleValidationErrors,
  createUser
);

routerUsers.patch(
  "/updateUser/:idUser",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  upload.single("photo_user"),
  validateUserById,
  validateUpdateUser,
  handleValidationErrors,
  updateUser
);

routerUsers.post(
  "/getUsersAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  validateUserAll,
  handleValidationErrors,
  getUsersAll
);

routerUsers.get(
  "/getImage/:fileName",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  validateFileNameImage,
  handleValidationErrors,
  getImage
);

routerUsers.get(
  "/getAreasTotal",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  getAreasTotal
);

routerUsers.get(
  "/removeStateUser/:idUser",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateUserById,
  handleValidationErrors,
  removeStateUser
);

// routerUsers.get(
//   "/getAreaById/:idArea",
//   ensureJWTAuth,
//   hasType(["Administrador", "Director", "Gestor"]),
//   validateUserById,
//   handleValidationErrors,
//   getAreaById
// );

routerUsers.get(
  "/getDownloadUser/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Gestor"]),
  validateUserState,
  handleValidationErrors,
  getDownloadUser
);

export default routerUsers;
