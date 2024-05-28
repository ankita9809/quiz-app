// Global imports
const CryptoJS = require("crypto-js");

// Local imports
const { ENV } = require("../config/env");

exports.encryptData = async (data) => {
  try {
    const encrypt = await CryptoJS.AES.encrypt(
      data,
      ENV.CRYPTOJS_SECRET_KEY
    ).toString();
    return encrypt;
  } catch (error) {
    return "";
  }
};

exports.decryptData = async (data) => {
  try {
    const decrypt = await CryptoJS.AES.decrypt(
      data,
      ENV.CRYPTOJS_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    return decrypt;
  } catch (error) {
    return "";
  }
};
