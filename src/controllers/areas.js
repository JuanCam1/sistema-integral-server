import { matchedData } from "express-validator";
import {
  countAllModel,
  createAreaModel,
  getAreaByIdModel,
  getAreaIsExistModel,
  getAreasAllModel,
  getDownloadAreaModel,
  removeStateAreaModel,
  updateAreaModel
} from "../models/areas.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import { formatterCapitalize } from "../utils/capitalize.js";
import XlsxPopulate from "xlsx-populate";

export const createArea = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const nameSearch = formatterCapitalize(data.name_area);
    const [[[area]]] = await getAreaIsExistModel(nameSearch);

    switch (area.result) {
      case -1:
        return sendErrorResponse(res, 404, 402, "Area exists");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const { name_area, sede_area, address_area, flat_area, phone_area, extension_area } = data;
    const nameCapitalize = formatterCapitalize(name_area);
    const sedeCapitalize = formatterCapitalize(sede_area);
    const addresCapitalize = formatterCapitalize(address_area);
    const flatCapitalize = formatterCapitalize(flat_area);

    const [[[id_area]]] = await createAreaModel(
      nameCapitalize,
      sedeCapitalize,
      addresCapitalize,
      flatCapitalize,
      phone_area,
      extension_area
    );

    if (!id_area) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (id_area) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in SQL");
      case -3:
        return sendErrorResponse(res, 500, 301, "Error durante ejecución");
    }

    return sendSuccesResponse(res, 202, data.id_area);
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getAreasAll = async (req, res) => {
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

    const [[[areasCount]]] = await countAllModel(filter);

    if (!areasCount) return sendErrorResponse(res, 500, 301, "Error in database");

    if (areasCount.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    if (areasCount.length == 0) return sendErrorResponse(res, 404, 301, "Is empty");

    const [[areas]] = await getAreasAllModel(data.limit, data.offset, order_by, data.order, filter);

    if (!areas) return sendErrorResponse(res, 500, 301, "Error in database");

    if (areas.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (areas[0].result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, {
      count: areasCount.count,
      areas: areas
    });
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

export const removeStateArea = async (req, res) => {
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

    const [[[updateStateArea]]] = await removeStateAreaModel(data.idArea);

    if (!updateStateArea) return sendErrorResponse(res, 500, 301, "Error in database");

    if (updateStateArea.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const updateArea = async (req, res) => {
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

    const { idArea, name_area, sede_area, address_area, flat_area, phone_area, extension_area } =
      data;

    const isValid = (value) => value.trim() !== "";

    const nameCapitalize = isValid(name_area) ? formatterCapitalize(name_area) : area.name_area;
    const sedeCapitalize = isValid(sede_area) ? formatterCapitalize(sede_area) : area.sede_area;
    const addresCapitalize = isValid(address_area)
      ? formatterCapitalize(address_area)
      : area.addres_area;
    const flatCapitalize = isValid(flat_area) ? formatterCapitalize(flat_area) : area.flat_area;
    const idValidate = isValid(idArea) ? Number(idArea) : area.id_area;
    const phoneValidate = isValid(phone_area) ? phone_area : area.phone_area;
    const extensionValidate = isValid(extension_area) ? extension_area : area.extension_area;

    const [[[idAreaBD]]] = await updateAreaModel(
      idValidate,
      nameCapitalize,
      sedeCapitalize,
      addresCapitalize,
      flatCapitalize,
      phoneValidate,
      extensionValidate
    );

    if (!idAreaBD) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idAreaBD.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -10:
        return sendErrorResponse(res, 500, 301, "Area no exist");
    }

    return sendSuccesResponse(res, 202, "area update");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadArea = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[areas]] = await getDownloadAreaModel(data.state);
    // console.log(areas);

    if (!areas) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (areas.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Area no exist");
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    const headers = [
      "ID",
      "Nombre Area",
      "Sede",
      "Dirección",
      "Piso",
      "Telefono",
      "Extensión",
      "Estado"
    ];
    headers.forEach((header, idx) => {
      sheet.cell(1, idx + 1).value(header);
    });

    areas.forEach((area, rowIndex) => {
      console.log(area)
      console.log(area.extension_area)
      sheet.cell(rowIndex + 2, 1).value(area.id_area);
      sheet.cell(rowIndex + 2, 2).value(area.name_area);
      sheet.cell(rowIndex + 2, 3).value(area.sede_area);
      sheet.cell(rowIndex + 2, 4).value(area.address_area);
      sheet.cell(rowIndex + 2, 5).value(area.flat_area);
      sheet.cell(rowIndex + 2, 6).value(area.phone_area);
      sheet.cell(rowIndex + 2, 7).value(area.extension_area);
      sheet.cell(rowIndex + 2, 8).value(area.active_area === 1 ? "Activo" : "Inactivo");
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=areas.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
