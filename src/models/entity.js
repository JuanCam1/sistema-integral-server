import { db } from "../../db/db.js";

export const createEntityModel = async (
  name_entity,
  address_entity,
  phone_entity,
  email_entity
) => {
  name_entity = name_entity ?? "";
  address_entity = address_entity ?? "";
  phone_entity = phone_entity ?? "";
  email_entity = email_entity ?? "";

  const values = [name_entity, address_entity, phone_entity, email_entity];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Entity_create(?,?,?,?)", values);
  return result;
};

export const getEntityByIdModel = async (id_entity) => {
  id_entity = id_entity ?? "";

  const values = [id_entity];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Entity_getById(?)", values);
  return result;
};

export const getEntityAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Entity_getAll(?,?,?,?,?)", values);
  return result;
};

export const getDownloadEntityModel = async (state) => {
  state = state ?? "2";

  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Entity_state(?)", values);
  return result;
};

export const removeStateEntityModel = async (id_entity) => {
  id_entity = id_entity ?? "";

  const values = [id_entity];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Entity_removeState(?)", values);
  return result;
};

export const updateEntityModel = async (
  id_entity,
  name_entity,
  address_entity,
  phone_entity,
  email_entity
) => {
  id_entity = id_entity ?? "";
  name_entity = name_entity ?? "";
  address_entity = address_entity ?? "";
  phone_entity = phone_entity ?? "";
  email_entity = email_entity ?? "";

  const values = [id_entity, name_entity, address_entity, phone_entity, email_entity];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Entity_patch(?,?,?,?,?)", values);
  return result;
};

export const countEntityAllModel = (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Entity_countAll(?)", values);
};


export const getEntityIsExistModel = async (value, procedure) => {
  value = value ?? "";
  const values = [value];

  const promisePool = db.get().promise();

  switch (procedure) {
    case "isExistEmail": {
      const result = await promisePool.query("CALL strp_Entity_isExistEmail(?)", values);
      return result;
    }
    case "isExistName": {
      const result = await promisePool.query("CALL strp_Entity_isExistName(?)", values);
      return result;
    }
  }
};