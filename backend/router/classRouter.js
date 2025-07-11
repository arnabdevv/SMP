const express = require("express");
const router = express.Router();

const { createClass } = require("../controllers/common/classController");

//base url
router.get("/", (req, res) => {
  res.send("Class Router");
});
//create class
router.post("/create", createClass);

module.exports = router;
