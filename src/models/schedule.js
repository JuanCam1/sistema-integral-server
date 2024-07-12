import { db } from "../../db/db.js";

export const getScheduleModel = async () => {
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Schedule_state()");
  return result;
};
