const express = require("express");
const {
  registerStudent,
} = require("../controllers/auth/studentAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hey Student");
});

router.post(
  "/register",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  registerStudent
);
module.exports = router;
