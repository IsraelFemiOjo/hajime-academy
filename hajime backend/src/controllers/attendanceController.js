const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Class = require("../models/Class");

// ===============================
// CREATE ATTENDANCE
// ===============================
const createAttendance = async (req, res) => {
  try {
    const {
      student,
      className,
      date,
      status,
      remarks,
    } = req.body;

    // Check required fields
    if (!student || !className || !date || !status) {
      return res.status(400).json({
        success: false,
        message:
          "Student, class, date and attendance status are required",
        data: null,
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
        data: null,
      });
    }

    // Validate attendance status
    if (
      !["present", "absent", "late", "excused"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be present, absent, late or excused",
        data: null,
      });
    }

    // Check student exists
    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    // Check class exists
    const existingClass = await Class.findById(className);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      student,
      date,
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance has already been recorded for this student on this date",
        data: null,
      });
    }

    // Create attendance
    // markedBy comes from the authenticated user
    const attendance = await Attendance.create({
      student,
      className,
      date,
      status,
      remarks: remarks?.trim() || "",
      markedBy: req.user.userId,
    });

    // Populate related data
    const populatedAttendance = await Attendance.findById(
      attendance._id
    )
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "markedBy",
        "firstName lastName email role"
      );

    return res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      data: populatedAttendance,
    });
  } catch (error) {
    console.error("Create attendance error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance has already been recorded for this student on this date",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student or class ID",
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
// GET ALL ATTENDANCE
// ===============================
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "markedBy",
        "firstName lastName email role"
      )
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// ===============================
// GET MY ATTENDANCE - STUDENT
// ===============================
const getMyAttendance = async (req, res) => {
  try {
    // Find the student record linked to the logged-in user
    const student = await Student.findOne({
      userId: req.user.userId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
        data: null,
      });
    }

    // Get only this student's attendance records
    const attendance = await Attendance.find({
      student: student._id,
    })
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "markedBy",
        "firstName lastName email role"
      )
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Your attendance records retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Get my attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// ===============================
// GET ATTENDANCE BY STUDENT
// ===============================
const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check student exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    const attendance = await Attendance.find({
      student: studentId,
    })
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "markedBy",
        "firstName lastName email role"
      )
      .sort({
        date: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Student attendance retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error(
      "Get student attendance error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
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
// GET ATTENDANCE BY CLASS
// ===============================
const getAttendanceByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Check class exists
    const schoolClass = await Class.findById(classId);

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    const attendance = await Attendance.find({
      className: classId,
    })
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "markedBy",
        "firstName lastName email role"
      )
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Class attendance retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error(
      "Get class attendance error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
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
// EXPORT CONTROLLERS
// ===============================
module.exports = {
  createAttendance,
  getAllAttendance,
  getMyAttendance,
  getAttendanceByStudent,
  getAttendanceByClass,
};