const express = require("express");

const {
  createResult,
  getAllResults,
  getResultById,
  getResultsByStudent,
  getResultsByClass,
  getMyResults,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// RESULT ROUTES
// =====================================

// =====================================
// STUDENT - VIEW OWN RESULTS
// =====================================

// Logged-in student can view only their own results
router.get(
  "/me",
  protect,
  authorize("student"),
  getMyResults
);

// =====================================
// ADMIN / TEACHER - CREATE RESULT
// =====================================

// Admin and teachers can record results
router.post(
  "/",
  protect,
  authorize("admin", "teacher"),
  createResult
);

// =====================================
// ADMIN / TEACHER - GET ALL RESULTS
// =====================================

// Admin and teachers can view all results
router.get(
  "/",
  protect,
  authorize("admin", "teacher"),
  getAllResults
);

// =====================================
// ADMIN / TEACHER - GET RESULTS BY STUDENT
// =====================================

router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "teacher"),
  getResultsByStudent
);

// =====================================
// ADMIN / TEACHER - GET RESULTS BY CLASS
// =====================================

router.get(
  "/class/:classId",
  protect,
  authorize("admin", "teacher"),
  getResultsByClass
);

// =====================================
// ADMIN / TEACHER - GET ONE RESULT
// =====================================

router.get(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  getResultById
);

// =====================================
// ADMIN - UPDATE RESULT
// =====================================

// Only admin can update results
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateResult
);

// =====================================
// ADMIN - DELETE RESULT
// =====================================

// Only admin can delete results
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteResult
);

module.exports = router;