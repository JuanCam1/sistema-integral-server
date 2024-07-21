import { matchedData } from "express-validator";
import {
  geReportAllModel,
  getReportByIdModel,
  getReportByIdAreaModel,
  countAllReportModel,
  createReportModel,
  updateReportModel,
  removeStateReportModel,
  getDownloadReportModel,
  getReportsAllUserModel,
  countAllReportUserModel,
  getReportsAllSinLimitUserModel
} from "../models/report.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import { formatterCapitalize } from "../utils/capitalize.js";
import XlsxPopulate from "xlsx-populate";
import { autoAdjustColumnWidth } from "../utils/ajustColum.js";
import archiver from "archiver";
import path from "path";
import fs from "fs";
import { logger } from "../services/apilogger.js";
import { loggerAdmin } from "../services/adminLogger.js";

export const createReport = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const dataHeader = req.header("X-User-Data");
  const data = matchedData(req);
  const payload = JSON.parse(dataHeader);

  try {
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

    const document_report = "Sindocumento";
    const document2_report = "Sindocumento";
    const date_register_report = "Sinfecha";
    const date_shipping_report = "Sinfecha";
    const state_report = "No Enviado";

    const {
      name_report,
      normativity_report,
      type_manual_report,
      manual_report,
      signature_report,
      date_from_report,
      date_to_report,
      userId,
      areaId,
      platformId,
      entityId
    } = data;

    const nameCapitalize = formatterCapitalize(name_report);
    const normativityCapitalize = formatterCapitalize(normativity_report);
    const signatureCapitalize = formatterCapitalize(signature_report);
    const typeManualCapitalize = formatterCapitalize(type_manual_report);

    const [[[idReport]]] = await createReportModel(
      nameCapitalize,
      normativityCapitalize,
      document_report,
      document2_report,
      typeManualCapitalize,
      manual_report,
      state_report,
      signatureCapitalize,
      date_from_report,
      date_to_report,
      date_register_report,
      date_shipping_report,
      userId,
      areaId,
      platformId,
      entityId,
      createUserValid
    );

    if (!idReport) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (idReport.result) {
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
    return sendSuccesResponse(res, 202, idReport);
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

const deleteReport = (filename) => {
  if (!filename) return;

  fs.unlink(path.join(process.cwd(), "uploads/reports", filename), (err) => {
    if (err) {
      console.error("Error deleting old image:", err);
      return res.status(500).json({ error: "Error deleting old image" });
    }
  });
};

export const updateDocumentReport = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const dataHeader = req.header("X-User-Data");
  const payload = JSON.parse(dataHeader);

  const data = matchedData(req);
  const files = req?.files;

  if (!files || files.length === 0) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"No files"}`
    );
    return sendErrorResponse(res, 404, 402, "No files");
  }
  try {
    const [[[report]]] = await getReportByIdModel(data.idReport);

    if (!report) {
      deleteReport(req?.files[0].filename);
      deleteReport(req?.files[1].filename);
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (report.result) {
      case -1: {
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
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
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "report no exist");
      }
    }

    if (payload.userIdPayload != report.id_user) {
      deleteReport(req?.files[0].filename);
      deleteReport(req?.files[1].filename);
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in authentification"}`
      );
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }

    const shipping = data.dateShippingReport ?? report.date_shipping_report

    const [[[idReportDb]]] = await updateReportModel(
      data.idReport,
      report.name_report,
      report.normativity_report,
      req?.files[0].filename ?? report.document_report,
      req?.files[1].filename ?? report.document2_report,
      report.type_manual_report,
      report.manual_report,
      report.state_report,
      report.signature_report,
      report.date_from_report,
      report.date_to_report,
      report.date_register_report,
      shipping,
      payload.userIdPayload,
      report.id_area,
      report.id_platform,
      report.id_entity,
      report.createUserId
    );

    if (!idReportDb) {
      deleteReport(req?.files[0].filename);
      deleteReport(req?.files[1].filename);
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (idReportDb.result) {
      case -1: {
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
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
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 500, 301, "report no exist");
      }
    }

    loggerAdmin.info(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(data)}","user":"${
        payload.namePayload
      }"}`
    );
    return sendSuccesResponse(res, 202, "report update");
  } catch (err) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "Error in service or database"}`
    );
    deleteReport(req?.files[0].filename);
    deleteReport(req?.files[1].filename);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const updateUploadReport = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const dataHeader = req.header("X-User-Data");
  const payload = JSON.parse(dataHeader);
  const data = matchedData(req);
  const files = req?.files;

  if (!files || files.length === 0) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"No Files"}`
    );
    return sendErrorResponse(res, 404, 402, "No files");
  }
  try {
    const [[[report]]] = await getReportByIdModel(data.idReport);

    if (!report) {
      deleteReport(req?.files[0].filename);
      deleteReport(req?.files[1].filename);
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (report.result) {
      case -1: {
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
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
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "report no exist");
      }
    }

    const stateValid = data.stateReport ?? report.state_report;

    if (payload.userIdPayload != report.id_user) {
      deleteReport(req?.files[0].filename);
      deleteReport(req?.files[1].filename);
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error": "Error in authentification"}`
      );
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }

    const [[[idReportDb]]] = await updateReportModel(
      data.idReport,
      report.name_report,
      report.normativity_report,
      req?.files[0].filename,
      req?.files[1].filename,
      report.type_manual_report,
      report.manual_report,
      stateValid,
      report.signature_report,
      report.date_from_report,
      report.date_to_report,
      data.dateRegisterReport,
      data.dateShippingReport,
      payload.userIdPayload,
      report.id_area,
      report.id_platform,
      report.id_entity,
      report.createUserId
    );

    if (!idReportDb) {
      deleteReport(req?.files[0].filename);
      deleteReport(req?.files[1].filename);
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (idReportDb.result) {
      case -1: {
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
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
        deleteReport(req?.files[0].filename);
        deleteReport(req?.files[1].filename);
        logger.error(
          `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
            req.params
          )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
            data
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 500, 301, "report no exist");
      }
    }

    loggerAdmin.info(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(data)}","user":"${
        payload.namePayload
      }"}`
    );
    return sendSuccesResponse(res, 202, "report update");
  } catch (err) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":${err}}`
    );
    deleteReport(req?.files[0].filename);
    deleteReport(req?.files[1].filename);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDocuments = async (req, res) => {
  const data = matchedData(req);

  if (data.document1 === "Sindocumento" && data.document2 === "Sindocumento") {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"No documents"}`
    );
    return sendErrorResponse(res, 404, 402, "No documents");
  }

  const archive = archiver("zip", {
    zlib: { level: 9 }
  });

  const [[[report]]] = await getReportByIdModel(data.idReport);

  if (!report) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"Error in database"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in database");
  }

  switch (report.result) {
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
        )}", "error":"report no exist"}`
      );
      return sendErrorResponse(res, 404, 402, "report no exist");
    }
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=documents.zip");

  try {
    const filenames = [data.document1, data.document2].filter((doc) => doc !== "Sindocumento");

    if (filenames.length === 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"No valid documents"}`
      );
      return sendErrorResponse(res, 404, 402, "No valid documents");
    }

    let filesToAdd = filenames.length;

    filenames.forEach((fileName, idx) => {
      const filepath = path.join(process.cwd(), "uploads/reports", fileName);

      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          logger.error(
            `{"verb":"${req.method}", "path":"${
              req.baseUrl + req.path
            }", "params":"${JSON.stringify(req.params)}", "query":"${JSON.stringify(
              req.query
            )}", "body":"${JSON.stringify(data)}", "error":${err}}`
          );
          return sendErrorResponse(res, 404, 301, {
            filepath
          });
        }

        archive.file(filepath, { name: fileName });

        filesToAdd--;
        if (filesToAdd === 0) {
          archive.finalize();
        }
      });
    });

    archive.on("error", (err) => {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error creating archive"}`
      );
      return sendErrorResponse(res, 500, 301, "Error creating archive");
    });

    archive.pipe(res);
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"Error in service or database"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const updateReport = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const data = matchedData(req);
  try {
    const {
      idReport,
      name_report,
      normativity_report,
      type_manual_report,
      manual_report,
      signature_report,
      date_from_report,
      date_to_report,
      userId,
      areaId,
      platformId,
      entityId
    } = data;

    const [[[report]]] = await getReportByIdModel(idReport);

    if (!report) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (report.result) {
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
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "report no exist");
      }
    }

    const isValid = (value) => value.trim() !== "" || value !== undefined || value !== null;

    const idValidate = isValid(idReport) ? Number(idReport) : report.id_report;
    const nameCapitalize = isValid(name_report) ? name_report : report.name_report;
    const normativityCapitalize = isValid(normativity_report)
      ? formatterCapitalize(normativity_report)
      : report.normativity_report;
    const typeManualCapitalize = isValid(type_manual_report)
      ? formatterCapitalize(type_manual_report)
      : report.type_manual_report;
    const manualValidate = isValid(manual_report) ? manual_report : report.manual_report;
    const signatureValidate = isValid(signature_report)
      ? formatterCapitalize(signature_report)
      : report.signature_report;

    const dateFromValidate = isValid(date_from_report) ? date_from_report : report.date_from_report;
    const dateToValidate = isValid(date_to_report) ? date_to_report : report.date_to_report;

    const userValid = userId ? Number(userId) : report.userId;
    const areaValid = areaId ? Number(areaId) : report.areaId;
    const platformValid = platformId ? Number(platformId) : report.platformId;
    const entityValid = entityId ? Number(entityId) : report.entityId;

    const createUserValid = payload.id_user;
    const document_report = report.document_report;
    const document2_report = report.document2_report;
    const state_report = formatterCapitalize(report.state_report);
    const date_register_report = report.date_register_report;
    const date_shipping_report = report.date_shipping_report;

    const [[[idReportDb]]] = await updateReportModel(
      idValidate,
      nameCapitalize,
      normativityCapitalize,
      document_report,
      document2_report,
      typeManualCapitalize,
      manualValidate,
      state_report,
      signatureValidate,
      dateFromValidate,
      dateToValidate,
      date_register_report,
      date_shipping_report,
      userValid,
      areaValid,
      platformValid,
      entityValid,
      createUserValid
    );

    if (!idReportDb) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (idReportDb.result) {
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
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 500, 301, "report no exist");
      }
    }

    return sendSuccesResponse(res, 202, "report update");
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":${error}}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getReportsAll = async (req, res) => {
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

    const [[[reportCount]]] = await countAllReportModel(filter);

    if (!reportCount) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (reportCount.result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (reportCount.length == 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Is empty"}`
      );
      return sendErrorResponse(res, 404, 301, "Is empty");
    }

    const [[reports]] = await geReportAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!reports) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (reports.length === 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Is empty"}`
      );
      return sendErrorResponse(res, 404, 301, "Is empty");
    }

    if (reports[0].result === -1) {
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
      count: reportCount.count,
      reports
    });
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":${error}}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getReportsAllUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const dataHeader = req.header("X-User-Data");
  const data = matchedData(req);
  try {
    const payload = JSON.parse(dataHeader);

    const userValid = payload.userIdPayload;
    const profileValid = payload.profilePayload;

    if (!userValid || profileValid !== "Funcionario") {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in authentification"}`
      );
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }
    const [state1, state2] = data.state_report;

    let filter = undefined;
    if (data.filter !== undefined) {
      filter = formatterCapitalize(data.filter);
    }

    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[reportCount]]] = await countAllReportUserModel(
      filter,
      profileValid,
      userValid,
      state1,
      state2
    );

    if (!reportCount) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 402, "Error in database");
    }

    if (reportCount.result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 402, "Error in database");
    }

    if (reportCount.length == 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Is empty"}`
      );
      return sendErrorResponse(res, 404, 301, "Is empty");
    }

    const [[reports]] = await getReportsAllUserModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter,
      profileValid,
      userValid,
      state1,
      state2
    );

    if (!reports) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 402, "Error in database");
    }

    if (reports.length === 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Is empty"}`
      );
      return sendErrorResponse(res, 404, 301, "Is empty");
    }

    if (reports[0].result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 402, "Error in database");
    }

    return sendSuccesResponse(res, 200, {
      count: reportCount.count,
      reports
    });
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":${error}}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getReportsAllSinLimitUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const data = matchedData(req);
  try {
    const dataHeader = req.header("X-User-Data");
    const payload = JSON.parse(dataHeader);

    const userValid = payload.userIdPayload;
    const profileValid = payload.profilePayload;

    if (!userValid || profileValid !== "Funcionario") {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in authentification"}`
      );
      return sendErrorResponse(res, 403, 107, "Error in authentification");
    }
    const [state1, state2] = data.state_report;

    const [[reports]] = await getReportsAllSinLimitUserModel(
      profileValid,
      userValid,
      state1,
      state2
    );

    if (!reports) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 402, "Error in database");
    }

    if (reports.length === 0) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Is empty"}`
      );
      return sendErrorResponse(res, 404, 301, "Is empty");
    }

    if (reports[0].result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 402, "Error in database");
    }

    return sendSuccesResponse(res, 200, reports);
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":${error}}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getReportByIdArea = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    const [[[report]]] = await getReportByIdAreaModel(data.idReport);

    if (!report) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (report.result) {
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
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "report no exist");
      }
    }

    return sendSuccesResponse(res, 200, {
      report
    });
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":${error}}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getReportById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    const [[[report]]] = await getReportByIdModel(data.idReport);

    if (!report) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (report.result) {
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
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "report no exist");
      }
    }

    return sendSuccesResponse(res, 200, {
      report
    });
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":"Error in service or database"}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const removeStateReport = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    const [[[report]]] = await getReportByIdModel(data.idReport);

    if (!report) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (report.result) {
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
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "report no exist");
      }
    }

    const [[[updateStateReport]]] = await removeStateReportModel(data.idReport);

    if (!updateStateReport) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    if (updateStateReport.result === -1) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    logger.error(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
        data
      )}", "error":${error}}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadReport = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[reports]] = await getDownloadReportModel(data.state);

    if (!reports) {
      logger.error(
        `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
          req.params
        )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
          data
        )}", "error":"Error in database"}`
      );
      return sendErrorResponse(res, 500, 301, "Error in database");
    }

    switch (reports.result) {
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
          )}", "error":"report no exist"}`
        );
        return sendErrorResponse(res, 404, 402, "reports no exist");
      }
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = [
      "ID",
      "Nombre",
      "Normatividad",
      "Manual",
      "Fecha Registro",
      "Fecha Envio",
      "Encargado",
      "Área",
      "Plataforma",
      "Entidad",
      "Estado Envio",
      "Estado Reporte",
      "Creado Por"
    ];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    reports.forEach((report, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(report.id_report)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(report.name_report)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(report.normativity_report)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(report.manual_report)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(report.date_register_report)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 6)
        .value(report.date_shipping_report)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 7)
        .value(`${report.names_user} ${report.lastnames}`)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 8)
        .value(report.name_area)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 9)
        .value(report.name_platform)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 10)
        .value(report.name_entity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 11)
        .value(report.state_report)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 12)
        .value(report.active_report === 1 ? "Activo" : "Inactivo")
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 13)
        .value(`${report.createdName} ${report.createdLastname}`)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Reportes.xlsx");
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
      )}", "error":${error}}`
    );
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
