const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Links this student record to the User account used for login
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    guardianName: {
      type: String,
      required: true,
      trim: true,
    },

    guardianPhone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);