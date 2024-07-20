import { matchedData } from "express-validator";
import {
  countSedeAllModel,
  createSedeModel,
  getDownloadSedeModel,
  getSedeAllModel,
  getSedeByIdModel,
  getSedeIsExistModel,
  removeStateSedeModel,
  updateSedeModel
} from "../models/sede.js";
import { formatterCapitalize } from "../utils/capitalize.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import XlsxPopulate from "xlsx-populate";
import { autoAdjustColumnWidth } from "../utils/ajustColum.js";

export const createSede = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const dataHeader = req.header("X-User-Data");
    const payload = JSON.parse(dataHeader);
    
    if (!payload.userIdPayload || payload.profilePayload !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }

    const createUserValid = payload.userIdPayload;

    const data = matchedData(req);

    const { name_sede, address_sede, ubication_sede } = data;
    const nameSearch = formatterCapitalize(name_sede);
    const [[[sede]]] = await getSedeIsExistModel(nameSearch);

    switch (sede.result) {
      case -1:
        return sendErrorResponse(res, 404, 402, "Sede exists");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const nameCapitalize = formatterCapitalize(name_sede);
    const addressCapitalize = formatterCapitalize(address_sede);
    const ubicationCapitalize = formatterCapitalize(ubication_sede);

    const [[[id_sede]]] = await createSedeModel(
      nameCapitalize,
      addressCapitalize,
      ubicationCapitalize,
      createUserValid
    );

    if (!id_sede) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (id_sede) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in SQL");
      case -3:
        return sendErrorResponse(res, 500, 301, "Error durante ejecución");
    }

    return sendSuccesResponse(res, 202, data.id_sede);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getSedeById = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[sede]]] = await getSedeByIdModel(data.idSede);

    if (!sede) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (sede.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Sede no exist");
    }

    return sendSuccesResponse(res, 200, {
      sede
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getSedeAll = async (req, res) => {
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

    const [[[sedesCount]]] = await countSedeAllModel(filter);

    if (!sedesCount) return sendErrorResponse(res, 500, 301, "Error in database");

    if (sedesCount.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    if (sedesCount.length == 0) return sendErrorResponse(res, 404, 301, "Is empty");

    const [[sedes]] = await getSedeAllModel(data.limit, data.offset, order_by, data.order, filter);

    if (!sedes) return sendErrorResponse(res, 500, 301, "Error in database");

    if (sedes.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (sedes[0].result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, {
      count: sedesCount.count,
      sedes: sedes
    });
  } catch (error) {
    // console.log("🚀 ~ getSedeAll ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const removeStateSede = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const dataHeader = req.header("X-User-Data");
    const payload = JSON.parse(dataHeader);
    
    if (!payload.userIdPayload || payload.profilePayload !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }

    const data = matchedData(req);

    const [[[sede]]] = await getSedeByIdModel(data.idSede);

    if (!sede) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (sede.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Sede no exist");
    }

    const [[[updateStateSede]]] = await removeStateSedeModel(data.idSede);

    if (!updateStateSede) return sendErrorResponse(res, 500, 301, "Error in database");

    if (updateStateSede.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const updateSede = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const dataHeader = req.header("X-User-Data");
    const payload = JSON.parse(dataHeader);
    
    if (!payload.userIdPayload || payload.profilePayload !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }

    const data = matchedData(req);
    const [[[sede]]] = await getSedeByIdModel(data.idSede);

    if (!sede) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (sede.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Sede no exist");
    }

    const { idSede, name_sede, address_sede, ubication_sede } = data;
    const isValid = (value) => value.trim() !== "";

    const idValidate = isValid(idSede) ? Number(idSede) : sede.id_sede;
    const nameCapitalize = isValid(name_sede) ? formatterCapitalize(name_sede) : sede.name_sede;
    const addressCapitalize = isValid(address_sede)
      ? formatterCapitalize(address_sede)
      : sede.address_sede;

    const ubicationCapitalize = isValid(ubication_sede)
      ? formatterCapitalize(ubication_sede)
      : sede.ubication_sede;

    const [[[idSedeBD]]] = await updateSedeModel(
      idValidate,
      nameCapitalize,
      addressCapitalize,
      ubicationCapitalize
    );

    if (!idSedeBD) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idSedeBD.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -10:
        return sendErrorResponse(res, 500, 301, "Sede no exist");
    }

    return sendSuccesResponse(res, 202, "Sede update");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadSede = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[sedes]] = await getDownloadSedeModel(data.state);

    if (!sedes) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (sedes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Sedes no exist");
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = ["ID", "Nombre Sede", "Dirección", "Ubicación", "Estado"];
    // , "Creado Por"
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    sedes.forEach((sede, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(sede.id_sede)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(sede.name_sede)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(sede.address_sede)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(sede.ubication_sede)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(sede.active_sede === 1 ? "Activo" : "Inactivo")
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      // sheet
      //   .cell(rowIndex + 2, 6)
      //   .value(`${sede.names_user} ${sede.lastnames}`)
      //   .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Sedes.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
