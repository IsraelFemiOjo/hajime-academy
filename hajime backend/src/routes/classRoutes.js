const express = require("express");

const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// CLASS ROUTES
// =====================================

// Create class
// Only admin can create a class
router.post(
  "/",
  protect,
  authorize("admin"),
  createClass
);

// Get all classes
// Admin and teachers can view classes
router.get(
  "/",
  protect,
  authorize("admin", "teacher"),
  getAllClasses
);

// Get one class
// Admin and teachers can view a class
router.get(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  getClassById
);

// Update class
// Only admin can update a class
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateClass
);

// Delete class
// Only admin can delete a class
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteClass
);

module.exports = router;