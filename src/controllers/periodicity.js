import { matchedData } from "express-validator";
import {
  countPeriodicityAllModel,
  createPeriodicityModel,
  getDownloadPeriodicityModel,
  getPeriodicityAllModel,
  getPeriodicityByIdModel,
  getPeriodicityIsExistModel,
  updatePeriodicityModel
} from "../models/periodicity.js";
import { formatterCapitalize } from "../utils/capitalize.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import XlsxPopulate from "xlsx-populate";
import { autoAdjustColumnWidth } from "../utils/ajustColum.js";

// 👍
export const createPeriodicity = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);
    const { type_periodicity } = data;

    const nameSearch = formatterCapitalize(type_periodicity);
    const [[[periodicity]]] = await getPeriodicityIsExistModel(nameSearch);

    switch (periodicity.result) {
      case -1:
        return sendErrorResponse(res, 404, 402, "Periodicity exists");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const nameCapitalize = formatterCapitalize(type_periodicity);

    const [[[id_periodicity]]] = await createPeriodicityModel(nameCapitalize);

    if (!id_periodicity) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (id_periodicity) {
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
export const getPeriodicityById = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[periodicity]]] = await getPeriodicityByIdModel(data.idPeriodicity);

    if (!periodicity) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (periodicity.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Periodicity no exist");
    }

    return sendSuccesResponse(res, 200, {
      periodicity
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const getPeriodicityAll = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    let filter = undefined;
    if (data.filter !== undefined) {
      filter = formatterCapitalize(data.filter);
    }

    //Assemble order_by
    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[periodicitiesCount]]] = await countPeriodicityAllModel(filter);

    if (!periodicitiesCount) return sendErrorResponse(res, 500, 301, "Error in database");

    if (periodicitiesCount.result === -1)
      return sendErrorResponse(res, 500, 301, "Error in database");

    if (periodicitiesCount.length == 0) return sendErrorResponse(res, 404, 301, "Is empty");

    const [[periodicities]] = await getPeriodicityAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!periodicities) return sendErrorResponse(res, 500, 301, "Error in database");

    if (periodicities.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (periodicities[0].result === -1)
      return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, {
      count: periodicitiesCount.count,
      periodicities: periodicities
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const updatePeriodicity = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const { idPeriodicity, type_periodicity } = data;
    const [[[periodicity]]] = await getPeriodicityByIdModel(idPeriodicity);

    if (!periodicity) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (periodicity.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Periodicity no exist");
    }

    const isValid = (value) => value.trim() !== "";

    const idValidate = isValid(idPeriodicity) ? Number(idPeriodicity) : periodicity.id_periodicity;
    const nameCapitalize = isValid(type_periodicity)
      ? formatterCapitalize(type_periodicity)
      : periodicity.type_periodicity;

    const [[[idPeriodicityBD]]] = await updatePeriodicityModel(idValidate, nameCapitalize);

    if (!idPeriodicityBD) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idPeriodicityBD.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -10:
        return sendErrorResponse(res, 500, 301, "Periodicity no exist");
    }

    return sendSuccesResponse(res, 202, "Periodicity update");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadPeriodicity = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const [[periodicities]] = await getDownloadPeriodicityModel();

    if (!periodicities) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (periodicities.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Periodicities no exist");
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = ["ID", "Tipo Periodicidad"];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    periodicities.forEach((periodicity, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(periodicity.id_periodicity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(periodicity.type_periodicity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Periodicidad.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
