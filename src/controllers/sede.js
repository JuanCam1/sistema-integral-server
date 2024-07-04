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

// 👍
export const createSede = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const nameSearch = formatterCapitalize(data.name_sede);
    const [[[sede]]] = await getSedeIsExistModel(nameSearch);

    switch (sede.result) {
      case -1:
        return sendErrorResponse(res, 404, 402, "Sede exists");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const { name_sede, address_sede, flat_sede, ubication_sede } = data;
    const nameCapitalize = formatterCapitalize(name_sede);
    const addressCapitalize = formatterCapitalize(address_sede);
    const flatCapitalize = formatterCapitalize(flat_sede);
    const ubicationCapitalize = formatterCapitalize(ubication_sede);

    const [[[id_sede]]] = await createSedeModel(
      nameCapitalize,
      addressCapitalize,
      flatCapitalize,
      ubicationCapitalize
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

// 👍
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

// 👍
export const getSedeAll = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const filter = undefined;
    if (data.filter !== undefined) {
      const filter_a = JSON.parse(data.filter);

      filter_a.forEach(function (element) {
        if (filter.length === 0)
          filter = filter + element.field + " " + element.operator + ' "' + element.value + '"';
        else
          filter =
            filter + " AND " + element.field + " " + element.operator + ' "' + element.value + '"';
      });
    }

    //Assemble order_by
    const order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[sedesCount]]] = await countSedeAllModel(filter);

    if (!sedesCount) return sendErrorResponse(res, 500, 301, "Error in database");

    if (sedesCount.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    if (sedesCount.length == 0) return sendErrorResponse(res, 404, 301, "Is empty");

    const [[sedes]] = await getSedeAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!sedes) return sendErrorResponse(res, 500, 301, "Error in database");

    if (sedes.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (sedes[0].result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, {
      count: sedesCount.count,
      sedes: sedes
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const removeStateSede = async (req, res) => {
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

    const [[[updateStateSede]]] = await removeStateSedeModel(data.idSede);

    if (!updateStateSede) return sendErrorResponse(res, 500, 301, "Error in database");

    if (updateStateSede.result === -1)
      return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const updateSede = async (req, res) => {
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

    const { idSede, name_sede,address_sede,flat_sede,ubication_sede } = data;
    const isValid = (value) => value.trim() !== "";

    const idValidate = isValid(idSede) ? Number(idSede) : sede.id_sede;
    const nameCapitalize = isValid(name_sede)
      ? formatterCapitalize(name_sede)
      : sede.name_sede;
    const addressCapitalize = isValid(address_sede)
      ? formatterCapitalize(address_sede)
      : sede.address_sede;
    const flatCapitalize = isValid(flat_sede)
      ? formatterCapitalize(flat_sede)
      : sede.flat_sede;
    const ubicationCapitalize = isValid(ubication_sede)
      ? formatterCapitalize(ubication_sede)
      : sede.ubication_sede;

    const [[[idSedeBD]]] = await updateSedeModel(idValidate, nameCapitalize,addressCapitalize,flatCapitalize,ubicationCapitalize);

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
    console.log("🏈",sedes)

    if (!sedes) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (sedes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Sedes no exist");
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    const headers = ["ID","Nombre Sede","Dirección","Piso","Ubicación","Estado"];
    headers.forEach((header, idx) => {
      sheet.cell(1, idx + 1).value(header);
    });

    sedes.forEach((sede, rowIndex) => {
      sheet.cell(rowIndex + 2, 1).value(sede.id_sede);
      sheet.cell(rowIndex + 2, 2).value(sede.name_sede);
      sheet.cell(rowIndex + 2, 3).value(sede.address_sede);
      sheet.cell(rowIndex + 2, 4).value(sede.flat_sede);
      sheet.cell(rowIndex + 2, 5).value(sede.ubication_sede);
      sheet.cell(rowIndex + 2, 6).value(sede.active_sede === 1 ? "Activo" : "Inactivo");
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=sedes.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
