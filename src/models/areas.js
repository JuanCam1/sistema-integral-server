import { db } from "../../db/db.js";

export const createAreaModel = async (
  name_area,
  sede_area,
  address_area,
  flat_area,
  phone_area,
  extension_area
) => {
  name_area = name_area ?? "";
  sede_area = sede_area ?? "";
  address_area = address_area ?? "";
  flat_area = flat_area ?? "";
  phone_area = phone_area ?? "";
  extension_area = extension_area ?? "";

  const values = [name_area, sede_area, address_area, flat_area, phone_area, extension_area];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_create_area(?,?,?,?,?,?)", values);
  return result;
};

export const getAreasAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Area_getAll(?,?,?,?,?)", values);
  return result;
};

export const countAllModel = (filter) => {
  //Checking data
  filter = filter ?? "";
  const values = [filter];
  //query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALl strp_Areas_countAll(?)", values);
};

export const getAreaByIdModel = async (id_area) => {
  id_area = id_area ?? "";

  const values = [id_area];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Area_getById(?)", values);
  return result;
};

export const getDownloadAreaModel = async (state) => {
  state = state ?? "2";

  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Areas_state(?)", values);
  return result;
};

export const getAreaByNameModel = async (name_area) => {
  name_area = name_area ?? "";

  const values = [name_area];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Area_getByName(?)", values);
  return result;
};

export const removeStateAreaModel = async (id_area) => {
  id_area = id_area ?? "";

  const values = [id_area];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Area_removeState(?)", values);
  return result;
};

export const updateAreaModel = async (
  id_area,
  name_area,
  sede_area,
  address_area,
  flat_area,
  phone_area,
  extension_area,
) => {
  //Checking Data
  id_area = id_area ?? "";
  name_area = name_area ?? "";
  sede_area = sede_area ?? "";
  address_area = address_area ?? "";
  flat_area = flat_area ?? "";
  phone_area = phone_area ?? "";
  extension_area = extension_area ?? "";

  const values = [
    id_area,
    name_area,
    sede_area,
    address_area,
    flat_area,
    phone_area,
    extension_area
  ]

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Area_patch(?, ?, ?, ?, ?, ?, ?)", values);
  return result;
};
