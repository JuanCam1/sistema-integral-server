import { db } from "../../db/db.js";


export const createReportModel = async (
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
) => {
  nameCapitalize = nameCapitalize ?? "";
  normativityCapitalize = normativityCapitalize ?? "";
  typeManualCapitalize = typeManualCapitalize ?? "";
  manual_report = manual_report ?? "";
  state_report = state_report ?? "Pendiente";
  document_report = document_report ?? "Sindocumento";
  document2_report = document2_report ?? "Sindocumento";
  signatureCapitalize = signatureCapitalize ?? "";
  date_from_report = date_from_report ?? "";
  date_to_report = date_to_report ?? "";
  date_register_report = date_register_report ?? "Sinfecha";
  date_shipping_report = date_shipping_report ?? "Sinfecha";
  userId = userId ?? "";
  areaId = areaId ?? "";
  platformId = platformId ?? "";
  entityId = entityId ?? "";
  createUserValid = createUserValid ?? "";

  const values = [
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
  ];

  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_Report_create(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    values
  );
  return result;
};

export const updateReportModel = async (
  id_report,
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
) => {
  id_report = id_report ?? "";
  nameCapitalize = nameCapitalize ?? "";
  normativityCapitalize = normativityCapitalize ?? "";
  typeManualCapitalize = typeManualCapitalize ?? "";
  manual_report = manual_report ?? "";
  state_report = state_report ?? "Pendiente";
  document_report = document_report ?? "Sindocumento";
  document2_report = document2_report ?? "Sindocumento";
  signatureCapitalize = signatureCapitalize ?? "";
  date_from_report = date_from_report ?? "";
  date_to_report = date_to_report ?? "";
  date_register_report = date_register_report ?? "Sinfecha";
  date_shipping_report = date_shipping_report ?? "Sinfecha";
  userId = userId ?? "";
  areaId = areaId ?? "";
  platformId = platformId ?? "";
  entityId = entityId ?? "";
  createUserValid = createUserValid ?? "";

  const values = [
    id_report,
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
  ];

  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_Report_patch(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
    values
  );
  return result;
};

export const geReportAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Report_getAll(?,?,?,?,?)", values);
  return result;
};

export const getReportsAllUserModel = async (
  limit,
  offset,
  orderby,
  order,
  filter,
  profile_user,
  id_user,
  state1,
  state2
) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  filter = filter ?? "";
  profile_user = profile_user ?? "";
  id_user = id_user ?? "";
  state1 = state1 ?? "";
  state2 = state2 ?? "";

  const values = [limit, offset, orderby, order, filter, profile_user, id_user, state1, state2];
  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_Report_getAllByIdUser(?,?,?,?,?,?,?,?,?)",
    values
  );
  return result;
};

export const getReportsAllSinLimitUserModel = async (profile_user, id_user, state1, state2) => {
  profile_user = profile_user ?? "";
  id_user = id_user ?? "";
  state1 = state1 ?? "";
  state2 = state2 ?? "";

  const values = [profile_user, id_user, state1, state2];
  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_Report_getAllSinLimitByIdUser(?,?,?,?)",
    values
  );
  return result;
};

export const countAllReportModel = (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALl strp_Report_countAll(?)", values);
};

export const countAllReportUserModel = (filter, profile_user, id_user, state1, state2) => {
  filter = filter ?? "";
  profile_user = profile_user ?? "";
  id_user = id_user ?? "";
  state1 = state1 ?? "";
  state2 = state2 ?? "";
  const values = [filter, profile_user, id_user, state1, state2];
  const promisePool = db.get().promise();
  return promisePool.query("CALl strp_Report_countAllUser(?,?,?,?,?)", values);
};

export const getReportByIdAreaModel = async (id_area) => {
  id_area = id_area ?? "";

  const values = [id_area];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Report_getByIdArea(?)", values);
  return result;
};

export const getReportByIdModel = async (id_report) => {
  id_report = id_report ?? "";

  const values = [id_report];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Report_getById(?)", values);
  return result;
};

export const removeStateReportModel = async (id_report) => {
  id_report = id_report ?? "";

  const values = [id_report];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Report_changeActive(?)", values);
  return result;
};

export const getDownloadReportModel = async (state) => {
  state = state ?? "3";

  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Report_state(?)", values);
  return result;
};
