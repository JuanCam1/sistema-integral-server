import { matchedData } from "express-validator";
import {
  countPlatformAllModel,
  createPlatformModel,
  getDownloadPlatformModel,
  getPlatformByIdModel,
  getPlatformIsExistModel,
  getPlatformsAllModel,
  removeStatePlatformModel,
  updatePlatformModel
} from "../models/platform.js";
import { formatterCapitalize } from "../utils/capitalize.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import XlsxPopulate from "xlsx-populate";

// 👍
export const createPlatform = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);
    console.log("🚀 ~ createPlatform ~ data:", data);

    const nameSearch = formatterCapitalize(data.name_platform);
    const [[[platform]]] = await getPlatformIsExistModel(nameSearch);

    console.log("🚀 ~ createPlatform ~ platform:", platform);
    switch (platform.result) {
      case -1:
        return sendErrorResponse(res, 404, 402, "Platform exists");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const { name_platform } = data;
    const nameCapitalize = formatterCapitalize(name_platform);
    const [[[id_platform]]] = await createPlatformModel(nameCapitalize);

    if (!id_platform) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (id_platform) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in SQL");
      case -3:
        return sendErrorResponse(res, 500, 301, "Error durante ejecución");
    }

    return sendSuccesResponse(res, 202, data.id_platform);
  } catch (error) {
    // console.log(error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const getPlatformById = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[platform]]] = await getPlatformByIdModel(data.idPlatform);

    if (!platform) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (platform.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Platform no exist");
    }

    return sendSuccesResponse(res, 200, {
      platform
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const getPlatformsAll = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);
    console.log("🚀 ~ getPlatformsAll ~ data:", data);

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

    const [[[platformsCount]]] = await countPlatformAllModel(filter);

    if (!platformsCount) return sendErrorResponse(res, 500, 301, "Error in database");

    if (platformsCount.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    if (platformsCount.length == 0) return sendErrorResponse(res, 404, 301, "Is empty");

    const [[platforms]] = await getPlatformsAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!platforms) return sendErrorResponse(res, 500, 301, "Error in database");

    if (platforms.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (platforms[0].result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, {
      count: platformsCount.count,
      platforms: platforms
    });
  } catch (error) {
    console.log("🚀 ~ getPlatformsAll ~ error:", error);

    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const removeStatePlatform = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[platform]]] = await getPlatformByIdModel(data.idPlatform);

    if (!platform) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (platform.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Platform no exist");
    }

    const [[[updateStatePlatform]]] = await removeStatePlatformModel(data.idPlatform);

    if (!updateStatePlatform) return sendErrorResponse(res, 500, 301, "Error in database");

    if (updateStatePlatform.result === -1)
      return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
  console.log("🚀 ~ removeStatePlatform ~ platform:", platform);
};

// 👍
export const updatePlatform = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[platform]]] = await getPlatformByIdModel(data.idPlatform);

    if (!platform) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (platform.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Platform no exist");
    }

    const { idPlatform, name_platform } = data;
    const isValid = (value) => value.trim() !== "";

    const nameCapitalize = isValid(name_platform)
      ? formatterCapitalize(name_platform)
      : platform.name_platform;
    const idValidate = isValid(idPlatform) ? Number(idPlatform) : platform.id_platform;

    const [[[idPlatformBD]]] = await updatePlatformModel(idValidate, nameCapitalize);

    if (!idPlatformBD) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idPlatformBD.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -10:
        return sendErrorResponse(res, 500, 301, "Platform no exist");
    }

    return sendSuccesResponse(res, 202, "Platform update");
  } catch (error) {
    console.log("🚀 ~ updatePlatform ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadPlatform = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[platforms]] = await getDownloadPlatformModel(data.state);

    if (!platforms) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (platforms.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Platform no exist");
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    const headers = ["ID", "Nombre Plataforma", "Estado"];
    headers.forEach((header, idx) => {
      sheet.cell(1, idx + 1).value(header);
    });

    platforms.forEach((platform, rowIndex) => {
      sheet.cell(rowIndex + 2, 1).value(platform.id_platform);
      sheet.cell(rowIndex + 2, 2).value(platform.name_platform);
      sheet.cell(rowIndex + 2, 3).value(platform.active_platform === 1 ? "Activo" : "Inactivo");
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=platformas.xlsx");
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
