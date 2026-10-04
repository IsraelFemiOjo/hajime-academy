const express = require("express");

const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// ANNOUNCEMENT ROUTES
// =====================================

// Create announcement
// Only admin can create announcements
router.post(
  "/",
  protect,
  authorize("admin"),
  createAnnouncement
);

// Get all announcements
// Admin, teachers and students can view announcements
router.get(
  "/",
  protect,
  authorize("admin", "teacher", "student"),
  getAllAnnouncements
);

// Get one announcement
// Admin, teachers and students can view announcements
router.get(
  "/:id",
  protect,
  authorize("admin", "teacher", "student"),
  getAnnouncementById
);

// Update announcement
// Only admin can update announcements
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateAnnouncement
);

// Delete announcement
// Only admin can delete announcements
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAnnouncement
);

module.exports = router;