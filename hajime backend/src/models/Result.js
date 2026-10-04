const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    academicSession: {
      type: String,
      required: true,
      trim: true,
    },

    term: {
      type: String,
      required: true,
      enum: ["First Term", "Second Term", "Third Term"],
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D", "E", "F"],
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate result for the same student,
// subject, academic session and term.
resultSchema.index(
  {
    student: 1,
    subject: 1,
    academicSession: 1,
    term: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);