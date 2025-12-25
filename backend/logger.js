const debug = require("debug");

module.exports = {
  appLog: debug("development:app"),
  dbLog: debug("development:db"),
  authLog: debug("development:auth"),
};
