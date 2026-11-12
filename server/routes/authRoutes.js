const express = require("express");
const router = express.Router();
const { register, login, getMe, getAdminDashboard } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public authentication routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (Requires valid JWT token)
router.get("/me", protect, getMe);

// Admin-only protected route (Requires valid JWT token + admin role)
router.get("/admin-dashboard", protect, authorize("admin"), getAdminDashboard);

module.exports = router;

