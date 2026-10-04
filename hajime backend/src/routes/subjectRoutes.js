const express = require("express");

const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// SUBJECT ROUTES
// =====================================

// Create subject
// Only admin can create a subject
router.post(
  "/",
  protect,
  authorize("admin"),
  createSubject
);

// Get all subjects
// Admin and teachers can view subjects
router.get(
  "/",
  protect,
  authorize("admin", "teacher"),
  getAllSubjects
);

// Get one subject
// Admin and teachers can view a subject
router.get(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  getSubjectById
);

// Update subject
// Only admin can update a subject
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateSubject
);

// Delete subject
// Only admin can delete a subject
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteSubject
);

module.exports = router;