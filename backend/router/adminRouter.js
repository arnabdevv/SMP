// Admin Router
const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/auth/adminAuthController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");
const { dashboard } = require("../controllers/common/commonController");

// GET   /localhost:3000/admin/             - Test route ("Hey Admin")
router.get("/", (req, res) => {
  res.json({ message: "Hey Admin" });
});

// POST  /localhost:3000/admin/register     - Register a new admin
router.post("/register", registerAdmin);

// POST  /localhost:3000/admin/login        - Admin login
router.post("/login", loginAdmin);

// GET   /localhost:3000/admin/logout       - Admin logout
router.get("/logout", logoutAdmin);

// GET   /localhost:3000/admin/dashboard    - Admin dashboard (auth required)
router.get("/dashboard", isAuthenticated, authorizeRole("admin"), dashboard);

module.exports = router;
