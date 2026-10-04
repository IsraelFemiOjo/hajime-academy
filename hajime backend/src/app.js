const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");

const studentRoutes = require("./routes/studentRoutes");

const teacherRoutes = require("./routes/teacherRoutes");

const classRoutes = require("./routes/classRoutes");

const subjectRoutes = require("./routes/subjectRoutes");

const attendanceRoutes = require("./routes/attendanceRoutes");

const resultRoutes = require("./routes/resultRoutes");

const announcementRoutes = require("./routes/announcementRoutes");

const swaggerDocument = require("./config/swagger");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(helmet());

app.use(express.json());

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hajime Academy School Management System API is running",
    data: null,
  });
});

// ===============================
// API ROUTES
// ===============================

// Authentication
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);

// Students
app.use("/api/students", studentRoutes);

// Teachers
app.use("/api/teachers", teacherRoutes);

// Classes
app.use("/api/classes", classRoutes);

// Subjects
app.use("/api/subjects", subjectRoutes);

// Attendance
app.use("/api/attendance", attendanceRoutes);

// Results
app.use("/api/results", resultRoutes);

// Announcements
app.use("/api/announcements", announcementRoutes);

// ===============================
// SWAGGER DOCUMENTATION
// ===============================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// ===============================
// EXPORT APP
// ===============================

module.exports = app;