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
import { autoAdjustColumnWidth } from "../utils/ajustColum.js";
import { logger } from "../services/apilogger.js";
import { loggerAdmin } from "../services/adminLogger.js";

export const createPlatform = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const dataHeader = req.header("X-User-Data");
  const payload = JSON.parse(dataHeader);

  const data = matchedData(req);

  if (!payload.userIdPayload || payload.profilePayload !== "Administrador") {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"Error in authentification"}`
    );
    return sendErrorResponse(res, 403, 107, "Error in authentification");
  }
  const createUserValid = payload.userIdPayload;
  try {
    const { name_platform, website_platform, entityId, periodicityId } = data;
    const nameCapitalize = formatterCapitalize(name_platform);
    const [[[platform]]] = await getPlatformIsExistModel(nameCapitalize);

    switch (platform.result) {
      case -1: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Platform exists"}`
        );
        return sendErrorResponse(res, 404, 402, "Platform exists");
      }
      case -2: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error in database"}`
        );
        return sendErrorResponse(res, 500, 301, "Error in database");
      }
    }

    const [[[id_platform]]] = await createPlatformModel(
      nameCapitalize,
      website_platform,
      entityId,
      periodicityId,
      createUserValid
    );

    if (!id_platform) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (id_platform.result) {
      case -1: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error database"}`
        );
        return sendErrorResponse(res, 500, 402, "Error database");
      }
      case -2: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error in SQL"}`
        );
        return sendErrorResponse(res, 500, 301, "Error in SQL");
      }
      case -3: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error durante ejecución"}`
        );
        return sendErrorResponse(res, 500, 301, "Error durante ejecución");
      }
    }

    loggerAdmin.info(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(data)}","user":"${
        payload.namePayload
      }"}`
    );
    return sendSuccesResponse(res, 202, data.id_platform);
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"${error}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getPlatformById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    const [[[platform]]] = await getPlatformByIdModel(data.idPlatform);

    if (!platform) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (platform.result) {
      case -1: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error in database"}`
        );
        return sendErrorResponse(res, 500, 301, "Error in database");
      }
      case -2: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Platform no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "Platform no exist");
      }
    }

    return sendSuccesResponse(res, 200, {
      platform
    });
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"${error}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getPlatformsAll = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    let filter = undefined;
    if (data.filter !== undefined) {
      filter = formatterCapitalize(data.filter);
    }

    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[platformsCount]]] = await countPlatformAllModel(filter);

    if (!platformsCount) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (platformsCount.result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (platformsCount.length == 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Is empty"}`
      );
      return sendErrorResponse(res, 404, 301, "Is empty");
    }

    const [[platforms]] = await getPlatformsAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!platforms) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (platforms.length === 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Is empty"}`
      );
      return sendErrorResponse(res, 404, 301, "Is empty");
    }

    if (platforms[0].result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    return sendSuccesResponse(res, 200, {
      count: platformsCount.count,
      platforms: platforms
    });
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"${error}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const removeStatePlatform = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const dataHeader = req.header("X-User-Data");
  const payload = JSON.parse(dataHeader);

  if (!payload.userIdPayload || payload.profilePayload !== "Administrador") {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"Error in authentification"}`
    );
    return sendErrorResponse(res, 403, 107, "Error in authentification");
  }
  const data = matchedData(req);

  try {
    const [[[platform]]] = await getPlatformByIdModel(data.idPlatform);

    if (!platform) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (platform.result) {
      case -1: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error in database"}`
        );
        return sendErrorResponse(res, 500, 301, "Error in database");
      }
      case -2: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Platform no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "Platform no exist");
      }
    }

    const [[[updateStatePlatform]]] = await removeStatePlatformModel(data.idPlatform);

    if (!updateStatePlatform) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (updateStatePlatform.result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    loggerAdmin.info(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(data)}","user":"${
        payload.namePayload
      }"}`
    );
    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"${error}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const updatePlatform = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const dataHeader = req.header("X-User-Data");
  const payload = JSON.parse(dataHeader);

  if (!payload.userIdPayload || payload.profilePayload !== "Administrador") {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"Error in authentification"}`
    );
    return sendErrorResponse(res, 403, 107, "Error in authentification");
  }

  const data = matchedData(req);
  try {
    const { idPlatform, name_platform, website_platform, entityId, periodicityId } = data;
    const [[[platform]]] = await getPlatformByIdModel(idPlatform);

    if (!platform) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (platform.result) {
      case -1: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error in database"}`
        );
        return sendErrorResponse(res, 500, 301, "Error in database");
      }
      case -2: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Platform no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "Platform no exist");
      }
    }

    const isValid = (value) => value.trim() !== "";

    const nameCapitalize = isValid(name_platform)
      ? formatterCapitalize(name_platform)
      : platform.name_platform;

    const websitePlatformValid = website_platform ?? platform.website_platform;
    const entityValid = entityId ?? platform.entityId;
    const periodicityValid = periodicityId ?? platform.periodicityId;

    const [[[idPlatformBD]]] = await updatePlatformModel(
      idPlatform,
      nameCapitalize,
      websitePlatformValid,
      entityValid,
      periodicityValid
    );

    if (!idPlatformBD) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (idPlatformBD.result) {
      case -1: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error database"}`
        );
        return sendErrorResponse(res, 500, 402, "Error database");
      }
      case -10: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Platform no exist"}`
        );
        return sendErrorResponse(res, 500, 301, "Platform no exist");
      }
    }
    loggerAdmin.info(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(data)}","user":"${
        payload.namePayload
      }"}`
    );
    return sendSuccesResponse(res, 202, "Platform update");
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"${error}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadPlatform = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    const [[platforms]] = await getDownloadPlatformModel(data.state);

    if (!platforms) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (platforms.result) {
      case -1: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Error in database"}`
        );
        return sendErrorResponse(res, 500, 301, "Error in database");
      }
      case -2: {
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"Platforms no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "Platforms no exist");
      }
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = ["ID", "Nombre Plataforma", "Sitio web", "Entidad", "Periodicidad", "Estado"];
    // ,"Creado Por"
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    platforms.forEach((platform, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(platform.id_platform)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(platform.name_platform)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(platform.website_platform)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(platform.name_entity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(platform.type_periodicity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 6)
        .value(platform.active_platform === 1 ? "Activo" : "Inactivo")
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      // sheet
      // .cell(rowIndex + 2, 7)
      // .value(`${platform.names_user} ${platform.lastnames}`)
      // .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Plataformas.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"${error}"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
