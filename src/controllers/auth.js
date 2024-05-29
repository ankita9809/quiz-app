// Local impports
const { Users } = require("../models/users");
const { createToken } = require("../helpers/createToken");
const { encryptData, decryptData } = require("../helpers/crypto");
const { clientErrorResponse, successResponse } = require("../helpers/response");

const getUser = async (query = {}, project = {}) => {
  try {
    const getData = await Users.find(query, project);
    return getData;
  } catch (error) {
    return [];
  }
};

exports.signin = async (req, res) => {
  try {
    if (!req.body.name) return clientErrorResponse(res, "Required Name!");
    if (!req.body.email) return clientErrorResponse(res, "Required Email!");
    if (!req.body.password)
      return clientErrorResponse(res, "Required Password!");
    if (!req.body.mobile) return clientErrorResponse(res, "Required Mobile!");

    if (req.body.password !== req.body.confirmPassword)
      return clientErrorResponse(res, "Password Not matched!");

    const checkEmail = await getUser({ email: req.body.email });
    if (checkEmail.length > 0)
      return clientErrorResponse(res, "Email Already Exist!");

    const checkMobile = await getUser({ mobile: req.body.mobile });
    if (checkMobile.length > 0)
      return clientErrorResponse(res, "Mobile Already Exist!");

    req.body.password = await encryptData(req.body.password);

    const addUser = await Users.create(req.body);
    if (!addUser) return clientErrorResponse(res, "User Not Created!");

    return successResponse(res, "User Created Successfully!");
  } catch (error) {
    serverErrorResponse(res);
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email) return clientErrorResponse(res, "Required Email!");
    if (!req.body.password)
      return clientErrorResponse(res, "Required Password!");

    const getData = await getUser({ email: req.body.email });
    if (getData.length === 0)
      return clientErrorResponse(res, "Email Not Exist!");

    const decryptPassword = await decryptData(getData[0].password);

    if (req.body.password !== decryptPassword)
      return clientErrorResponse(res, "Invalid Username/Password!");

    let { password, authkey, createdAt, updatedAt, ...rest } = getData[0]._doc;

    let token = await createToken(rest);
    rest.token = token;

    await Users.updateOne(
      { _id: rest._id },
      { $set: { authkey: token } },
      { new: true }
    );

    return successResponse(res, "User Login Successfully!", rest);
  } catch (error) {
    serverErrorResponse(res);
  }
};
