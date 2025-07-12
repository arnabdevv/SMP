// Student Router
const express = require("express");
const {
  registerStudent,
  regis,
  registerStudentInBulk,
  loginStudent,
  logoutStudent,
} = require("../controllers/auth/studentAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");
const { dashboard } = require("../controllers/common/commonController");
const router = express.Router();

// GET   /api/student/                  - Test route ("Hey Student")
router.get("/", (req, res) => {
  res.send("Hey Student");
});

// POST  /api/student/register          - Register a new student (admin/teacher only)
router.post(
  "/register",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  registerStudent
);

// POST  /api/student/login          - Login a student
router.post("/login", loginStudent);

// POST  /api/student/bulkRegistration  - Register students in bulk (admin/teacher only)
router.post(
  "/bulkRegistration",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  registerStudentInBulk
);

// POST  /api/student/logout          - Logout a student
router.get("/logout", logoutStudent);

router.get("/dashboard", isAuthenticated, dashboard);
module.exports = router;
