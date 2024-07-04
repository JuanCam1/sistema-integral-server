import { db } from "../../db/db.js";

export const createPlatformModel = async (name_platform) => {
  name_platform = name_platform ?? "";

  const values = [name_platform];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_create(?)", values);
  return result;
};

export const getPlatformByIdModel = async (id_platform) => {
  id_platform = id_platform ?? "";

  const values = [id_platform];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_getById(?)", values);
  return result;
};

export const getPlatformsAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_getAll(?,?,?,?,?)", values);
  return result;
};

export const getDownloadPlatformModel = async (state) => {
  state = state ?? "2";

  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platforms_state(?)", values);
  return result;
};

export const removeStatePlatformModel = async (id_platform) => {
  id_platform = id_platform ?? "";

  const values = [id_platform];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_removeState(?)", values);
  return result;
};

export const updatePlatformModel =  async (id_platform,name_platform) => {
  id_platform = id_platform ?? "";
  name_platform = name_platform ?? "";

  const values = [id_platform,name_platform];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_patch(?,?)", values);
  return result;
};

export const countPlatformAllModel = (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Platform_countAll(?)", values);
};

export const getPlatformIsExistModel = async (name_platform) => {
  name_platform = name_platform ?? "";

  const values = [name_platform];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_isExist(?)", values);
  return result;
};
