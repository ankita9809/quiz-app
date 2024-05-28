// Global imports
const JWT = require("jsonwebtoken");

// Local imports
const { ENV } = require("../config/env");
const { unAuthResponse } = require("../helpers/response");

const { User } = require("../models/users");

exports.secureAuth = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) return unAuthResponse(res);

    const token = header.split(" ").at(-1);

    const getUser = await User.findOne({ authkey: token });
    if (!getUser) return unAuthResponse(res);
    const decoded = JWT.verify(getUser.authkey, ENV.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return unAuthResponse(res);
  }
};
