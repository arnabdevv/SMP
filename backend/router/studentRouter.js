// Student Router
const express = require("express");
const router = express.Router();

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
const {
  getStudentsByClassAndBatch,
  updateStudentDetails,
  getBatchDiagnostics,
  deleteStudent,
} = require("../controllers/common/studentController");

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

// POST  /api/student/update/:studentId          - Update a student
router.post("/update/:studentId", updateStudentDetails);

// POST  /api/student/logout          - Logout a student
router.get("/logout", logoutStudent);

router.get("/dashboard", isAuthenticated, authorizeRole("student"), dashboard);

// GET  /api/student/list - Get students by class and/or batch (admin/teacher only)
router.get(
  "/list",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  getStudentsByClassAndBatch
);

// GET  /api/student/diagnostics - Get batch diagnostics (admin/teacher only)
router.get(
  "/diagnostics",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  getBatchDiagnostics
);

// DELETE /api/student/:studentId - Delete a student (admin/teacher only)
router.delete(
  "/:studentId",
  isAuthenticated,
  authorizeRole("admin", "teacher"),
  deleteStudent
);

module.exports = router;
