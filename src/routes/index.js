// Local imports
const { secureAuth } = require("../middleware/checkToken");

// API routes
exports.apiRoutes = (app) => {
  // Without token authentication
  app.use(require("./auth")); // Auth apis (signup, signin)

  // With token authentiication
  app.use(secureAuth, require("./quiz"));
  app.use(secureAuth, require("./questionnaire"));
};
