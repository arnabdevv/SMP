const express = require("express");
const {
  registerStudent,
  regis,
  registerStudentInBulk,
} = require("../controllers/auth/studentAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hey Student");
});

//Student Registration
router.post(
  "/register",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  registerStudent
);

//Student Registration in bulk
router.post(
  "/bulkRegistration",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  registerStudentInBulk
);
module.exports = router;
