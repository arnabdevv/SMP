// Admin Router
const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/auth/adminAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { dashboard } = require("../controllers/common/commonController");

// GET   /api/admin/             - Test route ("Hey Admin")
router.get("/", (req, res) => {
  res.json({ message: "Hey Admin" });
});

// POST  /api/admin/register     - Register a new admin
router.post("/register", registerAdmin);

// POST  /api/admin/login        - Admin login
router.post("/login", loginAdmin);

// GET   /api/admin/logout       - Admin logout
router.get("/logout", logoutAdmin);

// GET   /api/admin/dashboard    - Admin dashboard (auth required)
router.get("/dashboard", isAuthenticated, dashboard);

module.exports = router;
