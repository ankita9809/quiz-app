// Global imports
const mongoose = require("mongoose");

// Local imports
const { ENV } = require("./env");

exports.connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("Database connected!");
  } catch (error) {
    console.log("Database not connected!");
    console.log(error.message);
  }
};
