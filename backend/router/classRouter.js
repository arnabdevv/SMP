// Class Router
const express = require("express");
const router = express.Router();

const {
  createClass,
  fetchClasses,
} = require("../controllers/common/classController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

// GET   /api/class/         - Test route ("Class Router")
router.get("/", (req, res) => {
  res.send("Class Router");
});

// GET   /api/class/all      - Get all classes with populated batches(id & name)
router.get(
  "/all",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  fetchClasses
);

// POST  /api/class/create   - Create a new class
router.post("/create", createClass);

module.exports = router;
