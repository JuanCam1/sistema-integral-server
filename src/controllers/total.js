import { getDownloadAreaModel } from "../models/areas.js";
import { getDownloadEntityModel } from "../models/entity.js";
import { getDownloadPeriodicityModel } from "../models/periodicity.js";
import { getDownloadPlatformModel } from "../models/platform.js";
import { getDownloadSedeModel } from "../models/sede.js";
import { getDownloadUserModel, getUsersByIdAreaModel } from "../models/user.js";
import { sendErrorResponse, sendSuccesResponse } from "../utils/sendResponse.js";
import { matchedData } from "express-validator";

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

export const getEntitiesTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const [[entities]] = await getDownloadEntityModel("1");

    if (!entities) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (entities.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "Entities no exist");
    }

    return sendSuccesResponse(res, 200, {
      entities
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getPeriodicitiesTotal = async (req, res) => {
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

    return sendSuccesResponse(res, 200, {
      periodicities
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getPlatformsTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const [[platforms]] = await getDownloadPlatformModel("1");

    if (!platforms) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (platforms.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "platforms no exist");
    }

    return sendSuccesResponse(res, 200, {
      platforms
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getSedeTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const [[sedes]] = await getDownloadSedeModel("1");

    if (!sedes) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (sedes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "sedes no exist");
    }

    return sendSuccesResponse(res, 200, {
      sedes
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getUsersTotal = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const [[users]] = await getDownloadUserModel("1");

    if (!users) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (users.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "users no exist");
    }

    return sendSuccesResponse(res, 200, {
      users
    });
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};

export const getUsersByIdArea = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const data = matchedData(req);
    console.log("🚀 ~ getUsersByIdArea ~ data:", data);

    const [[users]] = await getUsersByIdAreaModel(data.idArea);
    console.log("🚀 ~ getUsersByIdArea ~ users:", users);

    if (!users) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (users.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 402, "users no exist");
    }

    return sendSuccesResponse(res, 200, {
      users
    });
  } catch (error) {
    console.log("🚀 ~ getUsersByIdArea ~ error:", error);
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};