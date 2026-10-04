const Teacher = require("../models/Teacher");

// ===============================
// EMAIL VALIDATION
// ===============================
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


// ===============================
// CREATE TEACHER
// ===============================
const createTeacher = async (req, res) => {
  try {
    let {
      userId,
      employeeNumber,
      firstName,
      lastName,
      email,
      phone,
      qualification,
      status,
    } = req.body;

    // Clean input
    userId = userId?.trim();
    employeeNumber = employeeNumber?.trim();
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    qualification = qualification?.trim();
    status = status?.trim().toLowerCase();

    // Required fields
    if (
      !userId ||
      !employeeNumber ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !qualification
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required teacher fields",
        data: null,
      });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
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

    // Check duplicate user
    const existingUser = await Teacher.findOne({ userId });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A teacher profile already exists for this user",
        data: null,
      });
    }

    // Check duplicate employee number
    const existingEmployee = await Teacher.findOne({
      employeeNumber,
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this employee number already exists",
        data: null,
      });
    }

    // Check duplicate email
    const existingEmail = await Teacher.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this email already exists",
        data: null,
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      userId,
      employeeNumber,
      firstName,
      lastName,
      email,
      phone,
      qualification,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Create teacher error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Teacher with one of these unique fields already exists",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
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
// GET ALL TEACHERS
// ===============================
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "firstName lastName email role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Teachers retrieved successfully",
      data: teachers,
    });
  } catch (error) {
    console.error("Get teachers error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


// ===============================
// GET SINGLE TEACHER
// ===============================
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      "userId",
      "firstName lastName email role"
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher retrieved successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Get teacher error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
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
// UPDATE TEACHER
// ===============================
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
        data: null,
      });
    }

    const allowedFields = [
      "userId",
      "employeeNumber",
      "firstName",
      "lastName",
      "email",
      "phone",
      "qualification",
      "status",
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        teacher[field] = req.body[field];
      }
    });

    // Clean values
    if (teacher.userId) {
      teacher.userId = teacher.userId.toString().trim();
    }

    if (teacher.employeeNumber) {
      teacher.employeeNumber = teacher.employeeNumber.trim();
    }

    if (teacher.firstName) {
      teacher.firstName = teacher.firstName.trim();
    }

    if (teacher.lastName) {
      teacher.lastName = teacher.lastName.trim();
    }

    if (teacher.email) {
      teacher.email = teacher.email.trim().toLowerCase();
    }

    if (teacher.phone) {
      teacher.phone = teacher.phone.trim();
    }

    if (teacher.qualification) {
      teacher.qualification = teacher.qualification.trim();
    }

    if (teacher.status) {
      teacher.status = teacher.status.trim().toLowerCase();
    }

    // Validate email if present
    if (teacher.email && !isValidEmail(teacher.email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
        data: null,
      });
    }

    // Validate status
    if (
      teacher.status &&
      !["active", "inactive"].includes(teacher.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be either active or inactive",
        data: null,
      });
    }

    // Check for duplicate values
    const duplicateUser = await Teacher.findOne({
      userId: teacher.userId,
      _id: { $ne: teacher._id },
    });

    if (duplicateUser) {
      return res.status(409).json({
        success: false,
        message: "A teacher profile already exists for this user",
        data: null,
      });
    }

    const duplicateEmployee = await Teacher.findOne({
      employeeNumber: teacher.employeeNumber,
      _id: { $ne: teacher._id },
    });

    if (duplicateEmployee) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this employee number already exists",
        data: null,
      });
    }

    const duplicateEmail = await Teacher.findOne({
      email: teacher.email,
      _id: { $ne: teacher._id },
    });

    if (duplicateEmail) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this email already exists",
        data: null,
      });
    }

    await teacher.save();

    const updatedTeacher = await Teacher.findById(
      teacher._id
    ).populate("userId", "firstName lastName email role");

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: updatedTeacher,
    });
  } catch (error) {
    console.error("Update teacher error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Teacher with one of these unique fields already exists",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID or user ID",
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
// DELETE TEACHER
// ===============================
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
        data: null,
      });
    }

    await Teacher.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete teacher error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
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
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};