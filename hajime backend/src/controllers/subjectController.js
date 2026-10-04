const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");

// ===============================
// CREATE SUBJECT
// ===============================
const createSubject = async (req, res) => {
  try {
    let {
      name,
      code,
      description,
      teacher,
      className,
      status,
    } = req.body;

    // Clean string values
    name = name?.trim();
    code = code?.trim().toUpperCase();
    description = description?.trim();
    teacher = teacher?.trim();
    className = className?.trim();
    status = status?.trim().toLowerCase();

    // Check required fields
    if (!name || !code || !teacher || !className) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide subject name, code, teacher and class",
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

    // Check if teacher exists
    const existingTeacher = await Teacher.findById(teacher);

    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
        data: null,
      });
    }

    // Check if class exists
    const existingClass = await Class.findById(className);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    // Check duplicate subject name
    const existingSubjectName = await Subject.findOne({
      name,
      className,
    });

    if (existingSubjectName) {
      return res.status(409).json({
        success: false,
        message: "This subject already exists for this class",
        data: null,
      });
    }

    // Check duplicate subject code
    const existingSubjectCode = await Subject.findOne({
      code,
      className,
    });

    if (existingSubjectCode) {
      return res.status(409).json({
        success: false,
        message: "This subject code already exists for this class",
        data: null,
      });
    }

    // Create subject
    const subject = await Subject.create({
      name,
      code,
      description: description || "",
      teacher,
      className,
      status: status || "active",
    });

    // Populate teacher and class
    const populatedSubject = await Subject.findById(
      subject._id
    )
      .populate(
        "teacher",
        "employeeNumber firstName lastName email phone qualification status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      );

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: populatedSubject,
    });
  } catch (error) {
    console.error("Create subject error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Subject with one of these unique fields already exists",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher or class ID",
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
// GET ALL SUBJECTS
// ===============================
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate(
        "teacher",
        "employeeNumber firstName lastName email phone qualification status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully",
      data: subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


// ===============================
// GET SINGLE SUBJECT
// ===============================
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate(
        "teacher",
        "employeeNumber firstName lastName email phone qualification status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject retrieved successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Get subject error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
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
// UPDATE SUBJECT
// ===============================
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
        data: null,
      });
    }

    const allowedFields = [
      "name",
      "code",
      "description",
      "teacher",
      "className",
      "status",
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        subject[field] = req.body[field];
      }
    });

    // Clean values
    if (subject.name) {
      subject.name = subject.name.trim();
    }

    if (subject.code) {
      subject.code = subject.code.trim().toUpperCase();
    }

    if (subject.description) {
      subject.description = subject.description.trim();
    }

    if (subject.teacher) {
      subject.teacher = subject.teacher.toString().trim();
    }

    if (subject.className) {
      subject.className = subject.className.toString().trim();
    }

    if (subject.status) {
      subject.status = subject.status.trim().toLowerCase();
    }

    // Validate status
    if (
      subject.status &&
      !["active", "inactive"].includes(subject.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be either active or inactive",
        data: null,
      });
    }

    // If teacher is being changed, verify teacher exists
    if (req.body.teacher !== undefined) {
      const existingTeacher = await Teacher.findById(
        req.body.teacher
      );

      if (!existingTeacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
          data: null,
        });
      }
    }

    // If class is being changed, verify class exists
    if (req.body.className !== undefined) {
      const existingClass = await Class.findById(
        req.body.className
      );

      if (!existingClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
          data: null,
        });
      }
    }

    // Check duplicate subject name within class
    const duplicateName = await Subject.findOne({
      name: subject.name,
      className: subject.className,
      _id: { $ne: subject._id },
    });

    if (duplicateName) {
      return res.status(409).json({
        success: false,
        message: "This subject already exists for this class",
        data: null,
      });
    }

    // Check duplicate code within class
    const duplicateCode = await Subject.findOne({
      code: subject.code,
      className: subject.className,
      _id: { $ne: subject._id },
    });

    if (duplicateCode) {
      return res.status(409).json({
        success: false,
        message: "This subject code already exists for this class",
        data: null,
      });
    }

    await subject.save();

    const updatedSubject = await Subject.findById(
      subject._id
    )
      .populate(
        "teacher",
        "employeeNumber firstName lastName email phone qualification status"
      )
      .populate(
        "className",
        "name level section academicSession capacity status"
      );

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject,
    });
  } catch (error) {
    console.error("Update subject error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Subject with one of these unique fields already exists",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID, teacher ID or class ID",
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
// DELETE SUBJECT
// ===============================
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
        data: null,
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
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
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};