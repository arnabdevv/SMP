const mongoose = require("mongoose");
const debug = require("debug")("development:app");
const { dbLog } = require("../logger");

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    dbLog("DB Connected...");
  })
  .catch((err) => {
    dbLog(err);
  });
module.exports = mongoose.connection;
