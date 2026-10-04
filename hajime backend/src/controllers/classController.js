const Class = require("../models/Class");
const Teacher = require("../models/Teacher");

// ===============================
// CREATE CLASS
// ===============================
const createClass = async (req, res) => {
  try {
    let {
      name,
      level,
      section,
      classTeacher,
      academicSession,
      capacity,
      status,
    } = req.body;

    // Clean string values
    name = name?.trim();
    level = level?.trim();
    section = section?.trim();
    classTeacher = classTeacher?.trim();
    academicSession = academicSession?.trim();
    status = status?.trim().toLowerCase();

    // Check required fields
    if (
      !name ||
      !level ||
      !section ||
      !classTeacher ||
      !academicSession ||
      capacity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required class fields",
        data: null,
      });
    }

    // Validate capacity
    if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a whole number greater than 0",
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

    // Check if class teacher exists
    const teacher = await Teacher.findById(classTeacher);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Class teacher not found",
        data: null,
      });
    }

    // Check duplicate class name
    const existingClass = await Class.findOne({ name });

    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: "A class with this name already exists",
        data: null,
      });
    }

    // Create class
    const newClass = await Class.create({
      name,
      level,
      section,
      classTeacher,
      academicSession,
      capacity: Number(capacity),
      status: status || "active",
    });

    // Populate class teacher
    const populatedClass = await Class.findById(newClass._id).populate(
      "classTeacher",
      "employeeNumber firstName lastName email phone qualification status"
    );

    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: populatedClass,
    });
  } catch (error) {
    console.error("Create class error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A class with this name already exists",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid class teacher ID",
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
// GET ALL CLASSES
// ===============================
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate(
        "classTeacher",
        "employeeNumber firstName lastName email phone qualification status"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Classes retrieved successfully",
      data: classes,
    });
  } catch (error) {
    console.error("Get classes error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};


// ===============================
// GET SINGLE CLASS
// ===============================
const getClassById = async (req, res) => {
  try {
    const schoolClass = await Class.findById(req.params.id).populate(
      "classTeacher",
      "employeeNumber firstName lastName email phone qualification status"
    );

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class retrieved successfully",
      data: schoolClass,
    });
  } catch (error) {
    console.error("Get class error:", error);

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
// UPDATE CLASS
// ===============================
const updateClass = async (req, res) => {
  try {
    const schoolClass = await Class.findById(req.params.id);

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    const allowedFields = [
      "name",
      "level",
      "section",
      "classTeacher",
      "academicSession",
      "capacity",
      "status",
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        schoolClass[field] = req.body[field];
      }
    });

    // Clean values
    if (schoolClass.name) {
      schoolClass.name = schoolClass.name.trim();
    }

    if (schoolClass.level) {
      schoolClass.level = schoolClass.level.trim();
    }

    if (schoolClass.section) {
      schoolClass.section = schoolClass.section.trim();
    }

    if (schoolClass.academicSession) {
      schoolClass.academicSession =
        schoolClass.academicSession.trim();
    }

    if (schoolClass.status) {
      schoolClass.status = schoolClass.status.trim().toLowerCase();
    }

    // Validate capacity
    if (
      !Number.isInteger(Number(schoolClass.capacity)) ||
      Number(schoolClass.capacity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a whole number greater than 0",
        data: null,
      });
    }

    schoolClass.capacity = Number(schoolClass.capacity);

    // Validate status
    if (
      schoolClass.status &&
      !["active", "inactive"].includes(schoolClass.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be either active or inactive",
        data: null,
      });
    }

    // If class teacher is being changed, verify teacher exists
    if (req.body.classTeacher !== undefined) {
      const teacher = await Teacher.findById(
        req.body.classTeacher
      );

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Class teacher not found",
          data: null,
        });
      }
    }

    // Check duplicate class name
    const duplicateClass = await Class.findOne({
      name: schoolClass.name,
      _id: { $ne: schoolClass._id },
    });

    if (duplicateClass) {
      return res.status(409).json({
        success: false,
        message: "A class with this name already exists",
        data: null,
      });
    }

    await schoolClass.save();

    const updatedClass = await Class.findById(
      schoolClass._id
    ).populate(
      "classTeacher",
      "employeeNumber firstName lastName email phone qualification status"
    );

    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Update class error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A class with this name already exists",
        data: null,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID or teacher ID",
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
// DELETE CLASS
// ===============================
const deleteClass = async (req, res) => {
  try {
    const schoolClass = await Class.findById(req.params.id);

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
        data: null,
      });
    }

    await Class.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete class error:", error);

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


module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};