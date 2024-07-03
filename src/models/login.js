import { db } from "../../db/db.js";

export const getByEmail = async (email_user) => {
  email_user = email_user ?? "";
  const values = [email_user];
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Login_getByEmail(?)", values);
  return result;
}

export const incrementLoginCount = async => (userId) => {
  //Checking data
  if (userId == undefined) userId = "";
  var values = [userId];
  // query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Login_incrementLoginCount(?)", values);
}
