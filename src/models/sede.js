import { db } from "../../db/db.js";

export const createSedeModel = async (name_sede, address_sede, ubication_sede, createdUser) => {
  name_sede = name_sede ?? "";
  address_sede = address_sede ?? "";
  ubication_sede = ubication_sede ?? "";
  createdUser = createdUser ?? "";

  const values = [name_sede, address_sede, ubication_sede, createdUser];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Sede_create(?,?,?,?)", values);
  return result;
};

export const getSedeByIdModel = async (id_sede) => {
  id_sede = id_sede ?? "";

  const values = [id_sede];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Sede_getById(?)", values);
  return result;
};

export const getSedeAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_sede";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Sede_getAll(?,?,?,?,?)", values);
  return result;
};

export const getDownloadSedeModel = async (state) => {
  state = state ?? "2";

  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Sede_state(?)", values);
  return result;
};

export const removeStateSedeModel = async (id_sede) => {
  id_sede = id_sede ?? "";

  const values = [id_sede];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Sede_removeState(?)", values);
  return result;
};

export const updateSedeModel = async (id_sede, name_sede, address_sede, ubication_sede) => {
  id_sede = id_sede ?? "";
  name_sede = name_sede ?? "";
  address_sede = address_sede ?? "";
  ubication_sede = ubication_sede ?? "";

  const values = [id_sede, name_sede, address_sede, ubication_sede];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Sede_patch(?,?,?,?)", values);
  return result;
};

export const countSedeAllModel = (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Sede_countAll(?)", values);
};

export const getSedeIsExistModel = async (name_sede) => {
  name_sede = name_sede ?? "";

  const values = [name_sede];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Sede_isExist(?)", values);
  return result;
};
