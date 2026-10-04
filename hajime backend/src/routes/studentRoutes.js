const express = require("express");

const {
  createStudent,
  getAllStudents,
  getStudentById,
  getMyStudentProfile,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// STUDENT ROUTES
// =====================================

// =====================================
// GET MY STUDENT PROFILE
// =====================================
// Logged-in student can view ONLY their own record
router.get(
  "/me",
  protect,
  authorize("student"),
  getMyStudentProfile
);

// =====================================
// CREATE STUDENT
// =====================================
// Admin and teacher can create students
router.post(
  "/",
  protect,
  authorize("admin", "teacher"),
  createStudent
);

// =====================================
// GET ALL STUDENTS
// =====================================
// Admin and teacher can view all students
router.get(
  "/",
  protect,
  authorize("admin", "teacher"),
  getAllStudents
);

// =====================================
// GET SINGLE STUDENT
// =====================================
// Admin and teacher can view a student
router.get(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  getStudentById
);

// =====================================
// UPDATE STUDENT
// =====================================
// Admin and teacher can update a student
router.patch(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  updateStudent
);

// =====================================
// DELETE STUDENT
// =====================================
// Only admin can delete a student
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudent
);

module.exports = router;