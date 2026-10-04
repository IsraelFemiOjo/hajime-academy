const express = require("express");

const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// TEACHER ROUTES
// =====================================

// Create teacher
// Only admin can create teacher profiles
router.post(
  "/",
  protect,
  authorize("admin"),
  createTeacher
);

// Get all teachers
// Admin and teacher can view teachers
router.get(
  "/",
  protect,
  authorize("admin", "teacher"),
  getAllTeachers
);

// Get one teacher
// Admin and teacher can view a teacher
router.get(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  getTeacherById
);

// Update teacher
// Only admin can update teacher profiles
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateTeacher
);

// Delete teacher
// Only admin can delete teacher profiles
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTeacher
);

module.exports = router;