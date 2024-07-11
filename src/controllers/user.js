import { matchedData } from "express-validator";
import * as bcryptjs from "bcryptjs";
import {
  countAllUsersModel,
  createUserModel,
  geUsersAllModel,
  getDownloadUserModel,
  getUserByIdModel,
  getUserIsExistModel,
  removeStateUserModel,
  updateUserModel
} from "../models/user.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import { formatterCapitalize } from "../utils/capitalize.js";
import { hashPassword } from "../utils/hashPassword.js";
import XlsxPopulate from "xlsx-populate";
import path from "path";
import fs from "fs";
import { getDownloadAreaModel } from "../models/areas.js";

const mimeTypes = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png"
};

export const getImage = async (req, res) => {
  const { fileName } = matchedData(req);

  const filepath = path.join(process.cwd(), "uploads/photos", fileName);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("err", err);
      return sendErrorResponse(res, 404, 301, {
        filepath
      });
    }

    const ext = path.extname(filepath).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.sendFile(filepath);
  });
};

export const getAreasTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const [[areas]] = await getDownloadAreaModel("1");

    if (!areas) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (areas.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Areas no exist");
    }

    return sendSuccesResponse(res, 200, {
      areas: areas
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const createUser = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);
    console.log("🚀 ~ createUser ~ data:", data);

    const {
      cedula_user,
      names_user,
      lastnames,
      phone_user,
      email_user,
      password_user,
      position_user,
      profile_user,
      areaId
    } = data;
    const nameCapitalize = formatterCapitalize(names_user);
    const lastnameCapitalize = formatterCapitalize(lastnames);
    const pisitionCapitalize = formatterCapitalize(position_user);
    const profileCapitalize = formatterCapitalize(profile_user);

    const [[[userDocument]]] = await getUserIsExistModel(cedula_user, "isExistDocument");
    const [[[userEmail]]] = await getUserIsExistModel(email_user, "isExistEmail");

    if (userDocument == -1 || userEmail == -1) {
      return sendErrorResponse(res, 404, 402, "User exists");
    }

    if (userDocument == -2 || userEmail == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const hashedPassword = await hashPassword(password_user);

    const photo = req?.file?.filename ?? "sinphoto.jpg";

    const [[[idUser]]] = await createUserModel(
      cedula_user,
      nameCapitalize,
      lastnameCapitalize,
      phone_user,
      email_user,
      hashedPassword,
      pisitionCapitalize,
      photo,
      profileCapitalize,
      areaId
    );

    if (!idUser) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idUser.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in SQL");
      case -3:
        return sendErrorResponse(res, 500, 301, "Error durante ejecución");
    }

    return sendSuccesResponse(res, 202, idUser);
  } catch (error) {
    console.log("🚀 ~ createUser ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getUsersAll = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    let filter = undefined;
    if (data.filter !== undefined) {
      filter = formatterCapitalize(data.filter);
    }

    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[usersCount]]] = await countAllUsersModel(filter);

    if (!usersCount) return sendErrorResponse(res, 500, 301, "Error in database");

    if (usersCount.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    if (usersCount.length == 0) return sendErrorResponse(res, 404, 301, "Is empty");

    const [[users]] = await geUsersAllModel(data.limit, data.offset, order_by, data.order, filter);

    if (!users) return sendErrorResponse(res, 500, 301, "Error in database");

    if (users.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (users[0].result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    const usersMap = users.map((user) => {
      let { id_area, name_area } = user;

      id_area = id_area ?? "0";
      name_area = name_area ?? "Sin Área";

      return {
        ...user,
        id_area,
        name_area
      };
    });

    return sendSuccesResponse(res, 200, {
      count: usersCount.count,
      users: usersMap
    });
  } catch (error) {
    // console.log("🚀 ~ getUsersAll ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const removeStateUser = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[user]]] = await getUserByIdModel(data.idUser);

    if (!user) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (user.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "User no exist");
    }

    const [[[updateStateUser]]] = await removeStateUserModel(data.idUser);

    if (!updateStateUser) return sendErrorResponse(res, 500, 301, "Error in database");

    if (updateStateUser.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// export const getAreaById = async (req, res) => {
//   try {
//     res.setHeader("Content-Type", "application/json");

//     const data = matchedData(req);

//     const [[[area]]] = await getAreaByIdModel(data.idArea);

//     if (!area) return sendErrorResponse(res, 500, 301, "Error in database");

//     switch (area.result) {
//       case -1:
//         return sendErrorResponse(res, 500, 301, "Error in database");
//       case -2:
//         return sendErrorResponse(res, 404, 402, "Area no exist");
//     }

//     return sendSuccesResponse(res, 200, {
//       area
//     });
//   } catch (error) {
//     return sendErrorResponse(res, 500, 301, "Error in service or database");
//   }
// };

export const updateUser = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);
    const newPhoto = req?.file?.filename;

    console.log("🚀 ~ updateuser ~ data:", data.profile_user);
    const {
      idUser,
      cedula_user,
      names_user,
      lastnames,
      phone_user,
      email_user,
      password_user,
      position_user,
      profile_user,
      areaId
    } = data;

    const [[[user]]] = await getUserByIdModel(idUser);
    // console.log("🚀 ~ updateUser ~ user:", user);
    // console.log("🚀 ~ updateuser ~ user:", user.profile_user);

    if (!user) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (user.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "User no exist");
    }

    const isValid = (value) => value.trim() !== "" || value !== undefined || value !== null;

    const idValidate = isValid(idUser) ? Number(idUser) : user.id_user;
    const cedulaValidate = isValid(cedula_user) ? cedula_user : user.cedula_user;
    const nameCapitalize = isValid(names_user) ? formatterCapitalize(names_user) : user.names_user;
    const lastnamesCapitalize = isValid(lastnames)
      ? formatterCapitalize(lastnames)
      : user.lastnames;
    const phoneValidate = isValid(phone_user) ? phone_user : user.phone_user;
    const emailValidate = isValid(email_user) ? email_user : user.email_user;

    const positionValidate = isValid(position_user) ? position_user : user.position_user;
    const profileValidate = isValid(profile_user) ? profile_user : user.profile_user;

    const areaValid = areaId ? Number(areaId) : user.id_area;

    let hashedPassword;
    if (password_user.length === 0) {
      if (password_user !== undefined) {
        hashedPassword = await hashPassword(password_user);
      } else {
        hashPassword = user.password_user;
      }
    }

    if (user.photo_user !== "sinphoto.jpg") {
      if (newPhoto && user.photo_user) {
        fs.unlink(path.join(process.cwd(), "uploads/photos", user.photo_user), (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
            return res.status(500).json({ error: "Error deleting old image" });
          }
        });
      }
    }

    const photo = newPhoto || user.photo_user;
    // console.log("🚀 ~ updateUser ~ photo:", photo);

    const [[[idUserDb]]] = await updateUserModel(
      idValidate,
      cedulaValidate,
      nameCapitalize,
      lastnamesCapitalize,
      phoneValidate,
      emailValidate,
      hashedPassword,
      positionValidate,
      profileValidate,
      photo,
      areaValid
    );
    // console.log("🚀 ~ updateArea ~ idUserDb:", idUserDb);

    if (!idUserDb) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idUserDb.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -10:
        return sendErrorResponse(res, 500, 301, "User no exist");
    }

    return sendSuccesResponse(res, 202, "user update");
  } catch (error) {
    // console.log("🚀 ~ updateUser ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadUser = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[users]] = await getDownloadUserModel(data.state);

    if (!users) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (users.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Users no exist");
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    const headers = [
      "Cedula",
      "Nombre Completo",
      "Telefono",
      "Correo",
      "Cargo",
      "Perfil",
      "Área",
      "Estado"
    ];
    headers.forEach((header, idx) => {
      sheet.cell(1, idx + 1).value(header);
    });

    users.forEach((user, rowIndex) => {
      sheet.cell(rowIndex + 2, 1).value(user.cedula_user);
      sheet.cell(rowIndex + 2, 2).value(`${user.names_user} ${user.lastnames} `);
      sheet.cell(rowIndex + 2, 3).value(user.phone_user);
      sheet.cell(rowIndex + 2, 4).value(user.email_user);
      sheet.cell(rowIndex + 2, 5).value(user.position_user);
      sheet.cell(rowIndex + 2, 6).value(user.profile_user);
      sheet.cell(rowIndex + 2, 7).value(user.name_area ? user.name_area : "Sin Área");
      sheet.cell(rowIndex + 2, 8).value(user.state_user === 1 ? "Activo" : "Inactivo");
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Usuarios.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
