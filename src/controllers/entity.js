import { matchedData } from "express-validator";
import {
  countEntityAllModel,
  createEntityModel,
  getDownloadEntityModel,
  getEntityAllModel,
  getEntityByIdModel,
  getEntityIsExistModel,
  removeStateEntityModel,
  updateEntityModel
} from "../models/entity.js";
import { formatterCapitalize } from "../utils/capitalize.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import XlsxPopulate from "xlsx-populate";
import { autoAdjustColumnWidth } from "../utils/ajustColum.js";

// 👍
export const createEntity = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const { name_entity, address_entity, phone_entity, email_entity } = data;
    const nameCapitalize = formatterCapitalize(name_entity);

    const [[[entity]]] = await getEntityIsExistModel(nameCapitalize, "isExistName");

    switch (entity.result) {
      case -1:
        return sendErrorResponse(res, 404, 402, "Entity exists");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in database");
    }

    const addressCapitalize = formatterCapitalize(address_entity);

    const [[[id_entity]]] = await createEntityModel(
      nameCapitalize,
      addressCapitalize,
      phone_entity,
      email_entity
    );
    if (!id_entity) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (id_entity) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -2:
        return sendErrorResponse(res, 500, 301, "Error in SQL");
      case -3:
        return sendErrorResponse(res, 500, 301, "Error durante ejecución");
    }

    return sendSuccesResponse(res, 202, id_entity);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const getEntityById = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[entity]]] = await getEntityByIdModel(data.idEntity);

    if (!entity) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (entity.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Entity no exist");
    }

    return sendSuccesResponse(res, 200, {
      entity
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const getEntityAll = async (req, res) => {
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

    const [[[entitiesCount]]] = await countEntityAllModel(filter);

    if (!entitiesCount) return sendErrorResponse(res, 500, 301, "Error in database");

    if (entitiesCount.result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    if (entitiesCount.length == 0) return sendErrorResponse(res, 404, 301, "Is empty");

    const [[entities]] = await getEntityAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!entities) return sendErrorResponse(res, 500, 301, "Error in database");

    if (entities.length === 0) return sendErrorResponse(res, 404, 301, "Is empty");

    if (entities[0].result === -1) return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, {
      count: entitiesCount.count,
      entities: entities
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const removeStateEntity = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[[entity]]] = await getEntityByIdModel(data.idEntity);

    if (!entity) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (entity.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Sede no exist");
    }

    const [[[updateStateEntity]]] = await removeStateEntityModel(data.idEntity);

    if (!updateStateEntity) return sendErrorResponse(res, 500, 301, "Error in database");

    if (updateStateEntity.result === -1)
      return sendErrorResponse(res, 500, 301, "Error in database");

    return sendSuccesResponse(res, 200, "update state");
  } catch (error) {
    console.log("🚀 ~ removeStateEntity ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getEntityTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[entities]] = await getDownloadEntityModel(data.state);

    if (!entities) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (entities.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "entities no exist");
    }

    return sendSuccesResponse(res, 200, {
      entities: entities
    });
  } catch (error) {
    console.log("🚀 ~ getEntityTotal ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

// 👍
export const updateEntity = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);
    console.log("🚀 ~ updateEntity ~ data:", data);
    const { idEntity, name_entity, address_entity, phone_entity, email_entity } = data;

    const [[[entity]]] = await getEntityByIdModel(idEntity);

    if (!entity) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (entity.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Entity no exist");
    }

    const isValid = (value) => value.trim() !== "";

    const idValidate = isValid(idEntity) ? Number(idEntity) : entity.id_entity;
    const nameCapitalize = isValid(name_entity)
      ? formatterCapitalize(name_entity)
      : entity.name_entity;
    const addressCapitalize = isValid(address_entity)
      ? formatterCapitalize(address_entity)
      : entity.address_entity;

    console.log(idValidate, nameCapitalize, addressCapitalize, phone_entity, email_entity);

    const [[[idEntityBD]]] = await updateEntityModel(
      idValidate,
      nameCapitalize,
      addressCapitalize,
      phone_entity,
      email_entity
    );

    if (!idEntityBD) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idEntityBD.result) {
      case -1:
        return sendErrorResponse(res, 500, 402, "Error database");
      case -10:
        return sendErrorResponse(res, 500, 301, "Entity no exist");
    }

    return sendSuccesResponse(res, 202, "Entity update");
  } catch (error) {
    console.log("🚀 ~ updateEntity ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getEntitiesTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[entities]] = await getDownloadEntityModel(data.state);

    if (!entities) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (entities.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "entities no exist");
    }

    return sendSuccesResponse(res, 200, {
      entities: entities
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getDownloadEntity = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[entities]] = await getDownloadEntityModel(data.state);

    if (!entities) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (entities.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "entities no exist");
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = ["ID", "Nombre Entidad", "Dirección", "Telefono", "Correo", "Estado"];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    entities.forEach((entity, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(entity.id_entity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(entity.name_entity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(entity.address_entity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(entity.phone_entity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(entity.email_entity)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 6)
        .value(entity.active_entity === 1 ? "Activo" : "Inactivo")
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Entidades.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
