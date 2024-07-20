import { db } from "../../db/db.js";

export const createPeriodicityModel = async (type_periodicity,createdUser) => {
  type_periodicity = type_periodicity ?? "";
  createdUser = createdUser ?? "";
  const values = [type_periodicity,createdUser];
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Periodicity_create(?,?)", values);
  return result;
};

export const getPeriodicityByIdModel = async (id_periodicity) => {
  id_periodicity = id_periodicity ?? "";

  const values = [id_periodicity];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Periodicity_getById(?)", values);
  return result;
};

export const getPeriodicityAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_periodicity";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Periodicity_getAll(?,?,?,?,?)", values);
  return result;
};

export const getDownloadPeriodicityModel = async () => {
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Periodicity_state()");
  return result;
};


export const updatePeriodicityModel =  async (id_periodicity,type_periodicity) => {
  id_periodicity = id_periodicity ?? "";
  type_periodicity = type_periodicity ?? "";

  const values = [id_periodicity,type_periodicity];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Periodicity_patch(?,?)", values);
  return result;
};

export const countPeriodicityAllModel = (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Periodicity_countAll(?)", values);
};

export const getPeriodicityIsExistModel = async (type_periodicity) => {
  type_periodicity = type_periodicity ?? "";

  const values = [type_periodicity];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Periodicity_isExist(?)", values);
  return result;
};
