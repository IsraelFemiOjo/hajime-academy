const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ===============================
// PUBLIC ROUTES
// ===============================

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);


// ===============================
// PROTECTED ROUTES
// ===============================

// Get currently logged-in user's profile
router.get("/me", protect, getMe);


// ===============================
// ROLE AUTHORIZATION TEST
// ===============================

// Only users with the "admin" role can access this route
router.get(
  "/admin-test",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      data: {
        userId: req.user.userId,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;