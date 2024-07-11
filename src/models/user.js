import { db } from "../../db/db.js";

export const createUserModel = async (
  cedula_user,
  names_user,
  lastnames,
  phone_user,
  email_user,
  password_user,
  position_user,
  photo_user,
  profile_user,
  areaId
) => {
  cedula_user = cedula_user ?? "";
  names_user = names_user ?? "";
  lastnames = lastnames ?? "";
  phone_user = phone_user ?? "";
  email_user = email_user ?? "";
  password_user = password_user ?? "";
  position_user = position_user ?? "";
  photo_user = photo_user ?? "";
  profile_user = profile_user ?? "";
  if (areaId === undefined || areaId === null || areaId === "" || areaId === 0) areaId = null;

  if (profile_user !== "Funcionario") {
    areaId = null;
  }

  const values = [
    cedula_user,
    names_user,
    lastnames,
    phone_user,
    email_user,
    password_user,
    position_user,
    photo_user,
    profile_user,
    areaId
  ];

  console.log(values);

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_User_create(?,?,?,?,?,?,?,?,?,?)", values);
  return result;
};

export const geUsersAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_User_getAll(?,?,?,?,?)", values);
  return result;
};

export const countAllUsersModel = (filter) => {
  //Checking data
  filter = filter ?? "";
  const values = [filter];
  //query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALl strp_User_countAll(?)", values);
};

export const getUserByIdModel = async (id_user) => {
  id_user = id_user ?? "";

  const values = [id_user];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_User_getById(?)", values);
  return result;
};

export const getDownloadUserModel = async (state) => {
  state = state ?? "2";

  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_User_state(?)", values);
  return result;
};

export const getUserIsExistModel = async (value, procedure) => {
  value = value ?? "";
  const values = [value];

  const promisePool = db.get().promise();

  switch (procedure) {
    case "isExistDocument": {
      const result = await promisePool.query("CALL strp_User_isExistDocument(?)", values);
      return result;
    }
    case "isExistEmail": {
      const result = await promisePool.query("CALL strp_User_isExistEmail(?)", values);
      return result;
    }
  }
};

export const removeStateUserModel = async (id_user) => {
  id_user = id_user ?? "";

  const values = [id_user];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_User_removeState(?)", values);
  return result;
};

export const updateUserModel = async (
  id_user,
  cedula_user,
  names_user,
  lastnames,
  phone_user,
  email_user,
  password_user,
  position_user,
  profile_user,
  photo_user,
  areaId
) => {
  id_user = id_user ?? "";
  cedula_user = cedula_user ?? "";
  names_user = names_user ?? "";
  lastnames = lastnames ?? "";
  phone_user = phone_user ?? "";
  email_user = email_user ?? "";
  password_user = password_user ?? "";
  position_user = position_user ?? "";
  photo_user = photo_user ?? "";
  profile_user = profile_user ?? "";

  if (areaId === undefined || areaId === null || areaId === "" || areaId === 0) areaId = null;

  const values = [
    id_user,
    cedula_user,
    names_user,
    lastnames,
    phone_user,
    email_user,
    password_user,
    position_user,
    photo_user,
    profile_user,
    areaId
  ];
  console.log("🚀 ~ values:", values);

  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_User_patch(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    values
  );
  return result;
};
