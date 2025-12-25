const mongoose = require("mongoose");
const debug = require("debug")("development:app");
const { dbLog } = require("../logger");

const uri = "mongodb+srv://arnab:motisir@cluster1.jm2owxl.mongodb.net/";

mongoose
  .connect(uri)
  .then(() => {
    dbLog("DB Connected...");
  })
  .catch((err) => {
    dbLog(err);
  });
module.exports = mongoose.connection;
