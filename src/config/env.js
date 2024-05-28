require("dotenv").config();

exports.ENV = {
  PORT_NO: process.env.PORT_NO,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  CRYPTOJS_SECRET_KEY: process.env.CRYPTOJS_SECRET_KEY,
};
