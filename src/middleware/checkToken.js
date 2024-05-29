// Global imports
const JWT = require("jsonwebtoken");

// Local imports
const { ENV } = require("../config/env");
const { unAuthResponse } = require("../helpers/response");

const { Users } = require("../models/users");

exports.secureAuth = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) return unAuthResponse(res, "Please provide token!");

    const token = header.split(" ").at(-1);

    const getUser = await Users.findOne({ authkey: token });
    if (!getUser) return unAuthResponse(res, "Invalid User");
    const decoded = JWT.verify(getUser.authkey, ENV.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return unAuthResponse(res, error);
  }
};
