const express = require("express");

const {
  createAttendance,
  getAllAttendance,
  getMyAttendance,
  getAttendanceByStudent,
  getAttendanceByClass,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// ATTENDANCE ROUTES
// =====================================

// Student - view only their own attendance
router.get(
  "/me",
  protect,
  authorize("student"),
  getMyAttendance
);

// Record attendance
// Admin and teachers can record attendance
router.post(
  "/",
  protect,
  authorize("admin", "teacher"),
  createAttendance
);

// Get all attendance records
// Admin and teachers can view attendance
router.get(
  "/",
  protect,
  authorize("admin", "teacher"),
  getAllAttendance
);

// Get attendance by student
// Admin and teachers can view attendance
router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "teacher"),
  getAttendanceByStudent
);

// Get attendance by class
// Admin and teachers can view attendance
router.get(
  "/class/:classId",
  protect,
  authorize("admin", "teacher"),
  getAttendanceByClass
);

module.exports = router;