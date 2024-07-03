export const sendErrorResponse = (res, status, code, message, details = null) => {
  return res
    .status(status)
    .send(JSON.stringify({ success: false, error: { code, message, details: details } }, null, 3));
};

export const sendSuccesResponse = (res, status, data) => {
  return res.status(status).send(JSON.stringify({ success: true, data }, null, 3));
};
