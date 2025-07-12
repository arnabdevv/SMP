// Teacher Router
const express = require("express");
const {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
} = require("../controllers/auth/teacherAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
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
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`${req.user.role}'s Dashboard Router`);
});

module.exports = router;
