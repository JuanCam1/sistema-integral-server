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

const mimeTypes = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
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
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    res.setHeader("Content-Type", mimeType); 
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.sendFile(filepath);
  });
};

export const getAreasTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    // Trae todas las sedes dependiendo su estado
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
      id_user,
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

    const [[[userDocument]]] = await getUserIsExistModel(id_user, "isExistDocument");
    const [[[userEmail]]] = await getUserIsExistModel(id_user, "isExistEmail");

    if (userDocument == -1 || userEmail == -1) {
      return sendErrorResponse(res, 404, 402, "User exists");
    }

    if (userDocument == -2 || userEmail == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const hashedPassword = await hashPassword(password_user);

    const photo = req?.file?.filename ?? "sinphoto.jpg";

    const [[[idUser]]] = await createUserModel(
      id_user,
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

    switch (id_user.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in SQL");
      case -3:
        return sendErrorResponse(res, 500, 301, "Error durante ejecución");
    }

    return sendSuccesResponse(res, 202, data.id_user);
  } catch (error) {
    // console.log("🚀 ~ createUser ~ error:", error);
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
    // console.log("🚀 ~ getUsersAll ~ users:", users);

    if (!users) return sendErrorResponse(res, 500, 301, "Error in database");

    if (users.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (users[0].result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    // console.log(path.join("/uploads/photos", "photo_user-1720619939831-706577545.jpg"));

    // users.map((user) => {
    //   if (user.photo_user !== "sinphoto.jpg") {
    //     return (user.photo_user = `/uploads/photos/${user.photo_user}`);
    //   }
    //   return user.photo_user;
    // });

    return sendSuccesResponse(res, 200, {
      count: usersCount.count,
      users: users
    });
  } catch (error) {
    console.log("🚀 ~ getUsersAll ~ error:", error);
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









export const getAreaById = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[area]]] = await getAreaByIdModel(data.idArea);

    if (!area) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (area.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Area no exist");
    }

    return sendSuccesResponse(res, 200, {
      area
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};



// export const updateArea = async (req, res) => {
//   try {
//     res.setHeader("Content-Type", "application/json");

//     const data = matchedData(req);
//     // console.log("🚀 ~ updateArea ~ data:", data);
//     const { idArea, name_area, phone_area, extension_area, flat_area, sedeId } = data;

//     const [[[area]]] = await getAreaByIdModel(idArea);
//     // console.log("🚀 ~ updateArea ~ area:", area);

//     if (!area) return sendErrorResponse(res, 500, 301, "Error in database");

//     switch (area.result) {
//       case -1:
//         return sendErrorResponse(res, 500, 301, "Error in database");
//       case -2:
//         return sendErrorResponse(res, 404, 402, "Area no exist");
//     }

//     const isValid = (value) => value.trim() !== "" || value !== undefined || value !== null;

//     const idValidate = isValid(idArea) ? Number(idArea) : area.id_area;
//     const nameCapitalize = isValid(name_area) ? formatterCapitalize(name_area) : area.name_area;
//     const phoneValidate = isValid(phone_area) ? phone_area : area.phone_area;
//     const extensionValidate = isValid(extension_area) ? extension_area : area.extension_area;
//     const flatCapitalize = isValid(flat_area) ? formatterCapitalize(flat_area) : area.flat_area;
//     const sedeCapitalize = sedeId ? Number(sedeId) : area.sedeId;

//     const [[[idAreaBD]]] = await updateAreaModel(
//       idValidate,
//       nameCapitalize,
//       phoneValidate,
//       extensionValidate,
//       flatCapitalize,
//       sedeCapitalize
//     );
//     console.log("🚀 ~ updateArea ~ idAreaBD:", idAreaBD);

//     if (!idAreaBD) return sendErrorResponse(res, 500, 301, "Error in database");

//     switch (idAreaBD.result) {
//       case -1:
//         return sendErrorResponse(res, 500, 402, "Error database");
//       case -10:
//         return sendErrorResponse(res, 500, 301, "Area no exist");
//     }

//     return sendSuccesResponse(res, 202, "area update");
//   } catch (error) {
//     console.log("🚀 ~ updateUser ~ error:", error);
//     return sendErrorResponse(res, 500, 301, "Error in service or database");
//   }
// };

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
      sheet.cell(rowIndex + 2, 1).value(user.id_user);
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
