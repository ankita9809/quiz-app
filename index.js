//GLOBAL IMPORTS
const express = require("express");
const app = express();
const cors = require("cors");

//LOCAL IMPORTS
const { ENV } = require("./src/config/env");
const { connectDB } = require("./src/config/database");
const { STATUS_CODE, clientErrorResponse } = require("./src/helpers/response");
const { apiRoutes } = require("./src/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = ENV.PORT_NO;

//API Routes
apiRoutes(app);

//to view the currently called API
app.use((req, res, next) => {
  console.log("HTTP METHOD - " + req.method + ", URL - " + req.url);
  next();
});

//API Not Found
app.use("*", (req, res) => {
  clientErrorResponse(res, "API Not Found", STATUS_CODE.NOT_FOUND);
});

//express configuration
app.listen(port, async () => {
  console.log(`Server is running on ${port}`);
  await connectDB();
});
