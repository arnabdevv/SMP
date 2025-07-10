const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/auth/adminAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  res.json({ message: "Hey Admin" });
});

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/logout", logoutAdmin);

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`${req.user.role}'s Dashboard Router`);
});

module.exports = router;
