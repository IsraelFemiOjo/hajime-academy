const Student = require("../models/Student");

// ===============================
// CREATE STUDENT
// ===============================
const createStudent = async (req, res) => {
  try {
    let {
      userId,
      admissionNumber,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      className,
      guardianName,
      guardianPhone,
      address,
      status,
    } = req.body;

    // Trim string values
    userId = userId?.trim();
    admissionNumber = admissionNumber?.trim();
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    gender = gender?.trim().toLowerCase();
    className = className?.trim();
    guardianName = guardianName?.trim();
    guardianPhone = guardianPhone?.trim();
    address = address?.trim();
    status = status?.trim().toLowerCase();

    // Check required fields
    if (
      !userId ||
      !admissionNumber ||
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !className ||
      !guardianName ||
      !guardianPhone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required student fields",
        data: null,
      });
    }

    // Validate gender
    if (!["male", "female"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Gender must be either male or female",
        data: null,
      });
    }

    // Validate status
    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either active or inactive",
        data: null,
      });
    }

    // Validate date of birth
    const parsedDate = new Date(dateOfBirth);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date of birth",
        data: null,
      });
    }

    // Check duplicate admission number
    const existingStudent = await Student.findOne({
      admissionNumber,
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "A student with this admission number already exists",
        data: null,
      });
    }

    // Check if user is already linked to a student
    const existingUserStudent = await Student.findOne({
      userId,
    });

    if (existingUserStudent) {
      return res.status(409).json({
        success: false,
        message: "This user is already linked to a student record",
        data: null,
      });
    }

    // Create student
    const student = await Student.create({
      userId,
      admissionNumber,
      firstName,
      lastName,
      gender,
      dateOfBirth: parsedDate,
      className,
      guardianName,
      guardianPhone,
      address,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create student error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A student with this admission number or user already exists",
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
// GET MY STUDENT PROFILE
// ===============================
const getMyStudentProfile = async (req, res) => {
  try {
    // The JWT stores the logged-in user's ID as "userId"
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

    return res.status(200).json({
      success: true,
      message: "Student profile retrieved successfully",
      data: student,
    });
  } catch (error) {
    console.error("Get my student profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// ===============================
// GET ALL STUDENTS
// ===============================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Students retrieved successfully",
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// ===============================
// GET SINGLE STUDENT
// ===============================
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    console.error("Get student error:", error);

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
// UPDATE STUDENT
// ===============================
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    const allowedFields = [
      "admissionNumber",
      "firstName",
      "lastName",
      "gender",
      "dateOfBirth",
      "className",
      "guardianName",
      "guardianPhone",
      "address",
      "status",
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    // Clean string values
    if (student.admissionNumber) {
      student.admissionNumber = student.admissionNumber.trim();
    }

    if (student.firstName) {
      student.firstName = student.firstName.trim();
    }

    if (student.lastName) {
      student.lastName = student.lastName.trim();
    }

    if (student.gender) {
      student.gender = student.gender.trim().toLowerCase();
    }

    if (student.className) {
      student.className = student.className.trim();
    }

    if (student.guardianName) {
      student.guardianName = student.guardianName.trim();
    }

    if (student.guardianPhone) {
      student.guardianPhone = student.guardianPhone.trim();
    }

    if (student.address) {
      student.address = student.address.trim();
    }

    if (student.status) {
      student.status = student.status.trim().toLowerCase();
    }

    // Validate gender
    if (
      student.gender &&
      !["male", "female"].includes(student.gender)
    ) {
      return res.status(400).json({
        success: false,
        message: "Gender must be either male or female",
        data: null,
      });
    }

    // Validate status
    if (
      student.status &&
      !["active", "inactive"].includes(student.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be either active or inactive",
        data: null,
      });
    }

    // Validate date of birth if supplied
    if (req.body.dateOfBirth !== undefined) {
      const parsedDate = new Date(req.body.dateOfBirth);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid date of birth",
          data: null,
        });
      }

      student.dateOfBirth = parsedDate;
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A student with this admission number already exists",
        data: null,
      });
    }

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
// DELETE STUDENT
// ===============================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete student error:", error);

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
// EXPORT CONTROLLERS
// ===============================
module.exports = {
  createStudent,
  getMyStudentProfile,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};