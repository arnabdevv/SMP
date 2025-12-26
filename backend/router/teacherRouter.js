// Teacher Router
const express = require("express");
const {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  deleteTeacher,
  updateTeacher,
} = require("../controllers/auth/teacherAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");
const { dashboard } = require("../controllers/common/commonController");
const { fetchTeachers } = require("../controllers/common/teacherController");
const router = express.Router();

// GET   /api/teacher/             - Test route ("Hey Teacher")
router.get("/", (req, res) => {
  res.send("Hey Teacher");
});

// POST  /api/teacher/register     - Register a new teacher
router.post("/register", registerTeacher);

// POST  /api/teacher/login        - Teacher login
router.post("/login", loginTeacher);

// GET   /api/teacher/logout       - Teacher logout
router.get("/logout", logoutTeacher);

// GET   /api/teacher/dashboard    - Teacher dashboard (auth required)
router.get("/dashboard", isAuthenticated, dashboard);

router.get(
  "/getAllTeachers",
  isAuthenticated,
  authorizeRole("admin"),
  fetchTeachers
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRole("admin"),
  deleteTeacher
);

router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRole("admin"),
  updateTeacher
);

module.exports = router;
