const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Class = require("../models/Class");

// ===============================
// CALCULATE GRADE
// ===============================
const calculateGrade = (score) => {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
};

// ===============================
// GET REMARKS FROM GRADE
// ===============================
const getRemarks = (grade) => {
  const remarks = {
    A: "Excellent performance",
    B: "Very good performance",
    C: "Good performance",
    D: "Fair performance",
    E: "Pass",
    F: "Needs improvement",
  };

  return remarks[grade];
};

// ===============================
// CREATE RESULT
// ===============================
const createResult = async (req, res) => {
  try {
    const {
      student,
      subject,
      className,
      academicSession,
      term,
      score,
      remarks,
    } = req.body;

    // Check required fields
    if (
      !student ||
      !subject ||
      !className ||
      !academicSession ||
      !term ||
      score === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student, subject, class, academic session, term and score are required",
        data: null,
      });
    }

    // Validate score
    const numericScore = Number(score);

    if (
      Number.isNaN(numericScore) ||
      numericScore < 0 ||
      numericScore > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Score must be a number between 0 and 100",
        data: null,
      });
    }

    // Validate term
    if (
      !["First Term", "Second Term", "Third Term"].includes(term)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Term must be First Term, Second Term or Third Term",
        data: null,
      });
    }

    // Check student
    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    // Check subject
    const existingSubject = await Subject.findById(subject);

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
        data: null,
      });
    }

    // Check class
    const existingClass = await Class.findById(className);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    // Calculate grade
    const grade = calculateGrade(numericScore);

    // Use supplied remarks or generate automatically
    const finalRemarks =
      remarks?.trim() || getRemarks(grade);

    // Check duplicate result
    const existingResult = await Result.findOne({
      student,
      subject,
      academicSession,
      term,
    });

    if (existingResult) {
      return res.status(409).json({
        success: false,
        message:
          "A result already exists for this student, subject, session and term",
        data: null,
      });
    }

    // Create result
    const result = await Result.create({
      student,
      subject,
      className,
      academicSession: academicSession.trim(),
      term,
      score: numericScore,
      grade,
      remarks: finalRemarks,
      recordedBy: req.user.userId,
    });

    // Populate related data
    const populatedResult = await Result.findById(result._id)
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "subject",
        "name code description teacher className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "recordedBy",
        "firstName lastName email role"
      );

    return res.status(201).json({
      success: true,
      message: "Result recorded successfully",
      data: populatedResult,
    });
  } catch (error) {
    console.error("Create result error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A result already exists for this student, subject, session and term",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student, subject or class ID",
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
// GET ALL RESULTS
// ===============================
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "subject",
        "name code description teacher className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "recordedBy",
        "firstName lastName email role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Results retrieved successfully",
      data: results,
    });
  } catch (error) {
    console.error("Get results error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// ===============================
// GET MY RESULTS - STUDENT
// ===============================
const getMyResults = async (req, res) => {
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

    // Get only this student's results
    const results = await Result.find({
      student: student._id,
    })
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "subject",
        "name code description teacher className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "recordedBy",
        "firstName lastName email role"
      )
      .sort({
        academicSession: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Your results retrieved successfully",
      data: results,
    });
  } catch (error) {
    console.error("Get my results error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

// ===============================
// GET RESULT BY ID
// ===============================
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "subject",
        "name code description teacher className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "recordedBy",
        "firstName lastName email role"
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get result error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID",
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
// GET RESULTS BY STUDENT
// ===============================
const getResultsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    const results = await Result.find({
      student: studentId,
    })
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "subject",
        "name code description teacher className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "recordedBy",
        "firstName lastName email role"
      )
      .sort({
        academicSession: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Student results retrieved successfully",
      data: results,
    });
  } catch (error) {
    console.error("Get student results error:", error);

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
// GET RESULTS BY CLASS
// ===============================
const getResultsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const schoolClass = await Class.findById(classId);

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    const results = await Result.find({
      className: classId,
    })
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "subject",
        "name code description teacher className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "recordedBy",
        "firstName lastName email role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Class results retrieved successfully",
      data: results,
    });
  } catch (error) {
    console.error("Get class results error:", error);

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
// UPDATE RESULT
// ===============================
const updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
        data: null,
      });
    }

    const allowedFields = [
      "student",
      "subject",
      "className",
      "academicSession",
      "term",
      "score",
      "remarks",
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        result[field] = req.body[field];
      }
    });

    // Clean values
    if (result.academicSession) {
      result.academicSession =
        result.academicSession.trim();
    }

    if (result.remarks) {
      result.remarks = result.remarks.trim();
    }

    // Validate term
    if (
      result.term &&
      ![
        "First Term",
        "Second Term",
        "Third Term",
      ].includes(result.term)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Term must be First Term, Second Term or Third Term",
        data: null,
      });
    }

    // Validate score
    const numericScore = Number(result.score);

    if (
      Number.isNaN(numericScore) ||
      numericScore < 0 ||
      numericScore > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Score must be a number between 0 and 100",
        data: null,
      });
    }

    result.score = numericScore;

    // Verify student if changed
    if (req.body.student !== undefined) {
      const student = await Student.findById(req.body.student);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
          data: null,
        });
      }
    }

    // Verify subject if changed
    if (req.body.subject !== undefined) {
      const subject = await Subject.findById(req.body.subject);

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
          data: null,
        });
      }
    }

    // Verify class if changed
    if (req.body.className !== undefined) {
      const schoolClass = await Class.findById(
        req.body.className
      );

      if (!schoolClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
          data: null,
        });
      }
    }

    // Recalculate grade
    result.grade = calculateGrade(result.score);

    // Update remarks automatically if not supplied
    if (req.body.remarks === undefined) {
      result.remarks = getRemarks(result.grade);
    }

    // Check duplicate result combination
    const duplicateResult = await Result.findOne({
      student: result.student,
      subject: result.subject,
      academicSession: result.academicSession,
      term: result.term,
      _id: { $ne: result._id },
    });

    if (duplicateResult) {
      return res.status(409).json({
        success: false,
        message:
          "A result already exists for this student, subject, session and term",
        data: null,
      });
    }

    await result.save();

    const updatedResult = await Result.findById(
      result._id
    )
      .populate(
        "student",
        "admissionNumber firstName lastName gender className status"
      )
      .populate(
        "subject",
        "name code description teacher className status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .populate(
        "recordedBy",
        "firstName lastName email role"
      );

    return res.status(200).json({
      success: true,
      message: "Result updated successfully",
      data: updatedResult,
    });
  } catch (error) {
    console.error("Update result error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A result already exists for this student, subject, session and term",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid result, student, subject or class ID",
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
// DELETE RESULT
// ===============================
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
        data: null,
      });
    }

    await Result.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete result error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID",
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
  createResult,
  getAllResults,
  getResultById,
  getResultsByStudent,
  getResultsByClass,
  getMyResults,
  updateResult,
  deleteResult,
};