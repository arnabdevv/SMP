const express = require("express");
const {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
} = require("../controllers/auth/teacherAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hey Teacher");
});

router.post("/register", registerTeacher);

router.post("/login", loginTeacher);

router.get("/logout", logoutTeacher);

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`${req.user.role}'s Dashboard Router`);
});

module.exports = router;
