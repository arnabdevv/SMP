// Class Router
const express = require("express");
const router = express.Router();

const { createClass } = require("../controllers/common/classController");

// GET   /api/class/         - Test route ("Class Router")
router.get("/", (req, res) => {
  res.send("Class Router");
});

// POST  /api/class/create   - Create a new class
router.post("/create", createClass);

module.exports = router;
