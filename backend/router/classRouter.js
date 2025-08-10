// Class Router
const express = require("express");
const router = express.Router();

const {
  createClass,
  fetchClasses,
} = require("../controllers/common/classController");

// GET   /api/class/         - Test route ("Class Router")
router.get("/", (req, res) => {
  res.send("Class Router");
});

// GET   /api/class/all      - Get all classes with populated batches(id & name)
const classModel = require("../models/classModel");
router.get("/all", fetchClasses);

// POST  /api/class/create   - Create a new class
router.post("/create", createClass);

module.exports = router;
