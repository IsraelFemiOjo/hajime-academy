const request = require("supertest");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = require("../src/app");

const createToken = (role) => {
  return jwt.sign(
    {
      userId: "000000000000000000000001",
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

describe("Hajime Academy API", () => {
  // =====================================
  // BASIC API TEST
  // =====================================

  test("GET / should return API status", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // =====================================
  // AUTHENTICATION TEST
  // =====================================

  test("Protected student route should reject unauthenticated requests", async () => {
    const response = await request(app).get("/api/students");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Authentication required");
  });

  // =====================================
  // STUDENT ROLE TEST
  // =====================================

  test("Student should not access student management list", async () => {
    const studentToken = createToken("student");

    const response = await request(app)
      .get("/api/students")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // =====================================
  // TEACHER ROLE TEST
  // =====================================

  test("Teacher should not create a teacher profile", async () => {
    const teacherToken = createToken("teacher");

    const response = await request(app)
      .post("/api/teachers")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        userId: "000000000000000000000001",
        employeeNumber: "TEST-001",
        firstName: "Test",
        lastName: "Teacher",
        email: "test@example.com",
        phone: "08000000000",
        qualification: "B.Ed",
        status: "active",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // =====================================
  // ATTENDANCE VALIDATION TEST
  // =====================================

  test("Attendance should reject missing required fields", async () => {
    const adminToken = createToken("admin");

    const response = await request(app)
      .post("/api/attendance")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        student: "000000000000000000000001",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // =====================================
  // RESULT VALIDATION TEST
  // =====================================

  test("Result should reject a score above 100", async () => {
    const adminToken = createToken("admin");

    const response = await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        student: "000000000000000000000001",
        subject: "000000000000000000000002",
        className: "000000000000000000000003",
        academicSession: "2026/2027",
        term: "First Term",
        score: 101,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Score must be a number between 0 and 100"
    );
  });

  // =====================================
  // SWAGGER TEST
  // =====================================

  test("Swagger documentation should be available", async () => {
    const response = await request(app).get("/api-docs/");

    expect(response.statusCode).toBe(200);
  });
});