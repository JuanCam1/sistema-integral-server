import { db } from "../../db/db.js";

export const createPlatformModel = async (
  name_platform,
  website_platform,
  sedeId,
  periodicityId,
  createdUser
) => {
  name_platform = name_platform ?? "";
  website_platform = website_platform ?? "";
  sedeId = sedeId ?? "";
  periodicityId = periodicityId ?? "";
  createdUser = createdUser ?? "";

  const values = [name_platform, website_platform, sedeId, periodicityId,createdUser];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_create(?,?,?,?,?)", values);
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
  orderby = orderby ?? "id_platform";
  order = order ?? "DESC";
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

export const updatePlatformModel = async (
  id_platform,
  name_platform,
  website_platform,
  entityId,
  periodicityId
) => {
  const values = [id_platform, name_platform, website_platform, entityId, periodicityId];
  console.log(values)
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Platform_patch(?,?,?,?,?)", values);
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
  const result = await promisePool.query("CALL strp_Platform_isExistName(?)", values);
  return result;
};
