import { Router } from "express";
import {
  createUser,
  getDownloadUser,
  getImage,
  getUsersAll,
  removeStateUser,
  updateNavbarUser,
  updateUser
} from "../controllers/user.js";
import {
  handleValidationErrors,
  validateCreateUser,
  validateFileNameImage,
  validateUpdateNavbarUser,
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
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png)"));
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
  hasType(["Administrador","Funcionario","Director"]),
  upload.single("photo_user"),
  validateUserById,
  validateUpdateUser,
  handleValidationErrors,
  updateUser
);

routerUsers.patch(
  "/updateNavbarUser/:idUser",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  upload.single("photo_user"),
  validateUserById,
  validateUpdateNavbarUser,
  handleValidationErrors,
  updateNavbarUser
);

routerUsers.post(
  "/getUsersAll",
  ensureJWTAuth,
  hasType(["Administrador", "Director"]),
  validateUserAll,
  handleValidationErrors,
  getUsersAll
);

routerUsers.get(
  "/getImage/:fileName",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  validateFileNameImage,
  handleValidationErrors,
  getImage
);

routerUsers.get(
  "/removeStateUser/:idUser",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateUserById,
  handleValidationErrors,
  removeStateUser
);

routerUsers.get(
  "/getDownloadUser/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Director", "Funcionario"]),
  validateUserState,
  handleValidationErrors,
  getDownloadUser
);

export default routerUsers;
