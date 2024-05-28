//object to define status codes.
exports.STATUS_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTH: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/**
 @function successResponse
 @description function to return API success response
 */
exports.successResponse = (res, message, result = []) => {
  return res
    .status(this.STATUS_CODE.OK)
    .json({ success: true, message, result });
};

/**
 @function clientErrorResponse
 @description function to return API failure due to client error response
 */
exports.clientErrorResponse = (
  res,
  message,
  statusCode = this.STATUS_CODE.BAD_REQUEST
) => {
  return res.status(statusCode).json({ success: false, message });
};

/**
 @function unAuthResponse
 @description function to return unauth response
 */
exports.unAuthResponse = (res, msg) => {
  return res
    .status(this.STATUS_CODE.UNAUTH)
    .json({ success: false, message: msg });
};

/**
 @function dataNotFound
 @description function to return unauth response
 */
exports.dataNotFound = (res, message) => {
  return res
    .status(this.STATUS_CODE.NOT_FOUND)
    .json({ success: false, message });
};

/**
 @function serverErrorResponse
 @description function to return API server error response
 */
exports.serverErrorResponse = (res, errorMsg) => {
  return res
    .status(this.STATUS_CODE.SERVER_ERROR)
    .json({ success: false, message: errorMsg || "Try Again Later!" });
};
