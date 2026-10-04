const Announcement = require("../models/Announcement");

// ===============================
// CREATE ANNOUNCEMENT
// ===============================
const createAnnouncement = async (req, res) => {
  try {
    let {
      title,
      message,
      audience,
      status,
    } = req.body;

    // Clean input
    title = title?.trim();
    message = message?.trim();
    audience = audience?.trim().toLowerCase();
    status = status?.trim().toLowerCase();

    // Required fields
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
        data: null,
      });
    }

    // Validate audience
    if (
      audience &&
      !["all", "teachers", "students"].includes(audience)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Audience must be all, teachers or students",
        data: null,
      });
    }

    // Validate status
    if (
      status &&
      !["draft", "published"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be either draft or published",
        data: null,
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      audience: audience || "all",
      status: status || "published",
      createdBy: req.user.userId,
    });

    const populatedAnnouncement =
      await Announcement.findById(announcement._id).populate(
        "createdBy",
        "firstName lastName email role"
      );

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: populatedAnnouncement,
    });
  } catch (error) {
    console.error(
      "Create announcement error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


// ===============================
// GET ALL ANNOUNCEMENTS
// ===============================
const getAllAnnouncements = async (req, res) => {
  try {
    let query = {};

    // Non-admin users only see published announcements
    if (req.user.role !== "admin") {
      query.status = "published";
    }

    // Filter announcements by audience
    if (req.user.role === "teacher") {
      query.audience = {
        $in: ["all", "teachers"],
      };
    } else if (req.user.role === "student") {
      query.audience = {
        $in: ["all", "students"],
      };
    }

    const announcements = await Announcement.find(query)
      .populate(
        "createdBy",
        "firstName lastName email role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Announcements retrieved successfully",
      data: announcements,
    });
  } catch (error) {
    console.error(
      "Get announcements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


// ===============================
// GET SINGLE ANNOUNCEMENT
// ===============================
const getAnnouncementById = async (req, res) => {
  try {
    const announcement =
      await Announcement.findById(req.params.id).populate(
        "createdBy",
        "firstName lastName email role"
      );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
        data: null,
      });
    }

    // Non-admin users cannot see drafts
    if (
      req.user.role !== "admin" &&
      announcement.status !== "published"
    ) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
        data: null,
      });
    }

    // Check audience access
    if (
      req.user.role === "teacher" &&
      !["all", "teachers"].includes(
        announcement.audience
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this announcement",
        data: null,
      });
    }

    if (
      req.user.role === "student" &&
      !["all", "students"].includes(
        announcement.audience
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this announcement",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement retrieved successfully",
      data: announcement,
    });
  } catch (error) {
    console.error(
      "Get announcement error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


// ===============================
// UPDATE ANNOUNCEMENT
// ===============================
const updateAnnouncement = async (req, res) => {
  try {
    const announcement =
      await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
        data: null,
      });
    }

    const allowedFields = [
      "title",
      "message",
      "audience",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        announcement[field] = req.body[field];
      }
    });

    // Clean values
    if (announcement.title) {
      announcement.title =
        announcement.title.trim();
    }

    if (announcement.message) {
      announcement.message =
        announcement.message.trim();
    }

    if (announcement.audience) {
      announcement.audience =
        announcement.audience
          .trim()
          .toLowerCase();
    }

    if (announcement.status) {
      announcement.status =
        announcement.status
          .trim()
          .toLowerCase();
    }

    // Validate audience
    if (
      announcement.audience &&
      !["all", "teachers", "students"].includes(
        announcement.audience
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Audience must be all, teachers or students",
        data: null,
      });
    }

    // Validate status
    if (
      announcement.status &&
      !["draft", "published"].includes(
        announcement.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be either draft or published",
        data: null,
      });
    }

    await announcement.save();

    const updatedAnnouncement =
      await Announcement.findById(
        announcement._id
      ).populate(
        "createdBy",
        "firstName lastName email role"
      );

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.error(
      "Update announcement error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


// ===============================
// DELETE ANNOUNCEMENT
// ===============================
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement =
      await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
        data: null,
      });
    }

    await Announcement.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error(
      "Delete announcement error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};