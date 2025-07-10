const mongoose = require("mongoose");
const debug = require("debug")("development:app");

const uri = "mongodb+srv://arnab:motisir@cluster1.jm2owxl.mongodb.net/";

mongoose
  .connect(uri)
  .then(() => {
    debug("DB Connected...");
  })
  .catch((err) => {
    debug(err);
  });
module.exports = mongoose.connection;
