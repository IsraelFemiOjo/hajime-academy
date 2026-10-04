const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "Hajime Academy School Management System API",
    version: "1.0.0",
    description:
      "API documentation for the Hajime Academy School Management System",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description: "User registration, login and authorization",
    },
    {
      name: "Users",
      description: "Admin user management",
    },
    {
      name: "Students",
      description: "Student management",
    },
    {
      name: "Teachers",
      description: "Teacher management",
    },
    {
      name: "Classes",
      description: "Class management",
    },
    {
      name: "Subjects",
      description: "Subject management",
    },
    {
      name: "Attendance",
      description: "Student attendance management",
    },
    {
      name: "Results",
      description: "Student results and grade management",
    },
    {
      name: "Announcements",
      description: "School announcements and communication",
    },
  ],

  components: {
    // =====================================
    // SECURITY
    // =====================================

    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    // =====================================
    // SCHEMAS
    // =====================================

    schemas: {
      // =====================================
      // AUTHENTICATION
      // =====================================

      RegisterRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: {
            type: "string",
            example: "Jane",
          },
          lastName: {
            type: "string",
            example: "Student",
          },
          email: {
            type: "string",
            format: "email",
            example: "janestudent@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            example: "Password123",
          },
          admissionNumber: {
            type: "string",
            example: "HAJ-2026-002",
            description:
              "Student admission number used to link the login account to the student's school record.",
          },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "admin@hajimeacademy.com",
          },
          password: {
            type: "string",
            example: "Admin12345",
          },
        },
      },

      // =====================================
      // USERS
      // =====================================

      CreateUserRequest: {
        type: "object",
        required: [
          "firstName",
          "lastName",
          "email",
          "password",
          "role",
        ],
        properties: {
          firstName: {
            type: "string",
            example: "David",
          },
          lastName: {
            type: "string",
            example: "Okoro",
          },
          email: {
            type: "string",
            format: "email",
            example: "teacher@hajimeacademy.com",
          },
          password: {
            type: "string",
            minLength: 6,
            example: "Teacher123",
          },
          role: {
            type: "string",
            enum: ["admin", "teacher", "student"],
            example: "teacher",
          },
        },
      },

      // =====================================
      // STUDENTS
      // =====================================

      StudentCreateRequest: {
        type: "object",
        required: [
          "admissionNumber",
          "firstName",
          "lastName",
          "gender",
          "dateOfBirth",
          "className",
          "guardianName",
          "guardianPhone",
          "address",
        ],
        properties: {
          admissionNumber: {
            type: "string",
            example: "HAJ-2026-002",
          },
          firstName: {
            type: "string",
            example: "Jane",
          },
          lastName: {
            type: "string",
            example: "Student",
          },
          gender: {
            type: "string",
            enum: ["male", "female"],
            example: "female",
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            example: "2014-08-15",
          },
          className: {
            type: "string",
            example: "Primary 6",
          },
          guardianName: {
            type: "string",
            example: "Mary Student",
          },
          guardianPhone: {
            type: "string",
            example: "08012345678",
          },
          address: {
            type: "string",
            example: "Lagos, Nigeria",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      StudentUpdateRequest: {
        type: "object",
        properties: {
          admissionNumber: {
            type: "string",
            example: "HAJ-2026-002",
          },
          firstName: {
            type: "string",
            example: "Jane",
          },
          lastName: {
            type: "string",
            example: "Student",
          },
          gender: {
            type: "string",
            enum: ["male", "female"],
            example: "female",
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            example: "2014-08-15",
          },
          className: {
            type: "string",
            example: "Primary 6",
          },
          guardianName: {
            type: "string",
            example: "Mary Student",
          },
          guardianPhone: {
            type: "string",
            example: "08098765432",
          },
          address: {
            type: "string",
            example: "Lagos, Nigeria",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      // =====================================
      // TEACHERS
      // =====================================

      TeacherCreateRequest: {
        type: "object",
        required: [
          "userId",
          "employeeNumber",
          "firstName",
          "lastName",
          "email",
          "phone",
          "qualification",
        ],
        properties: {
          userId: {
            type: "string",
            example: "6ab92d3c45386110c8b50797",
          },
          employeeNumber: {
            type: "string",
            example: "HAJ-T-001",
          },
          firstName: {
            type: "string",
            example: "David",
          },
          lastName: {
            type: "string",
            example: "Okoro",
          },
          email: {
            type: "string",
            format: "email",
            example: "teacher@hajimeacademy.com",
          },
          phone: {
            type: "string",
            example: "08098765432",
          },
          qualification: {
            type: "string",
            example: "M.Ed Mathematics",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      TeacherUpdateRequest: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            example: "6ab92d3c45386110c8b50797",
          },
          employeeNumber: {
            type: "string",
            example: "HAJ-T-001",
          },
          firstName: {
            type: "string",
            example: "David",
          },
          lastName: {
            type: "string",
            example: "Okoro",
          },
          email: {
            type: "string",
            format: "email",
            example: "teacher@hajimeacademy.com",
          },
          phone: {
            type: "string",
            example: "08098765432",
          },
          qualification: {
            type: "string",
            example: "M.Ed Mathematics",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      // =====================================
      // CLASSES
      // =====================================

      ClassCreateRequest: {
        type: "object",
        required: [
          "name",
          "level",
          "section",
          "classTeacher",
          "academicSession",
          "capacity",
        ],
        properties: {
          name: {
            type: "string",
            example: "Primary 6 A",
          },
          level: {
            type: "string",
            example: "Primary 6",
          },
          section: {
            type: "string",
            example: "A",
          },
          classTeacher: {
            type: "string",
            example: "6ab92eec58f84c38bd59c48e",
          },
          academicSession: {
            type: "string",
            example: "2026/2027",
          },
          capacity: {
            type: "integer",
            minimum: 1,
            example: 35,
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      ClassUpdateRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Primary 6 A",
          },
          level: {
            type: "string",
            example: "Primary 6",
          },
          section: {
            type: "string",
            example: "A",
          },
          classTeacher: {
            type: "string",
            example: "6ab92eec58f84c38bd59c48e",
          },
          academicSession: {
            type: "string",
            example: "2026/2027",
          },
          capacity: {
            type: "integer",
            minimum: 1,
            example: 35,
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      // =====================================
      // SUBJECTS
      // =====================================

      SubjectCreateRequest: {
        type: "object",
        required: ["name", "code", "teacher", "className"],
        properties: {
          name: {
            type: "string",
            example: "Mathematics",
          },
          code: {
            type: "string",
            example: "MATH",
          },
          description: {
            type: "string",
            example: "Advanced mathematics for Primary 6 students",
          },
          teacher: {
            type: "string",
            example: "6ab92eec58f84c38bd59c48e",
          },
          className: {
            type: "string",
            example: "6ab936b2d301d6677d780c33",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      SubjectUpdateRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Mathematics",
          },
          code: {
            type: "string",
            example: "MATH",
          },
          description: {
            type: "string",
            example: "Advanced mathematics for Primary 6 students",
          },
          teacher: {
            type: "string",
            example: "6ab92eec58f84c38bd59c48e",
          },
          className: {
            type: "string",
            example: "6ab936b2d301d6677d780c33",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      // =====================================
      // ATTENDANCE
      // =====================================

      AttendanceCreateRequest: {
        type: "object",
        required: ["student", "className", "date", "status"],
        properties: {
          student: {
            type: "string",
            example: "6abbbf9092af4e92ea6098af",
          },
          className: {
            type: "string",
            example: "6ab936b2d301d6677d780c33",
          },
          date: {
            type: "string",
            format: "date",
            example: "2026-09-29",
          },
          status: {
            type: "string",
            enum: ["present", "absent", "late", "excused"],
            example: "present",
          },
          remarks: {
            type: "string",
            example: "Arrived on time",
          },
        },
      },

      // =====================================
      // RESULTS
      // =====================================

      ResultCreateRequest: {
        type: "object",
        required: [
          "student",
          "subject",
          "className",
          "academicSession",
          "term",
          "score",
        ],
        properties: {
          student: {
            type: "string",
            example: "6abbbf9092af4e92ea6098af",
          },
          subject: {
            type: "string",
            example: "6ab93b81a0dd642d61220e36",
          },
          className: {
            type: "string",
            example: "6ab936b2d301d6677d780c33",
          },
          academicSession: {
            type: "string",
            example: "2026/2027",
          },
          term: {
            type: "string",
            enum: ["First Term", "Second Term", "Third Term"],
            example: "First Term",
          },
          score: {
            type: "number",
            minimum: 0,
            maximum: 100,
            example: 92,
          },
          remarks: {
            type: "string",
            example: "Outstanding performance",
          },
        },
      },

      ResultUpdateRequest: {
        type: "object",
        properties: {
          student: {
            type: "string",
            example: "6abbbf9092af4e92ea6098af",
          },
          subject: {
            type: "string",
            example: "6ab93b81a0dd642d61220e36",
          },
          className: {
            type: "string",
            example: "6ab936b2d301d6677d780c33",
          },
          academicSession: {
            type: "string",
            example: "2026/2027",
          },
          term: {
            type: "string",
            enum: ["First Term", "Second Term", "Third Term"],
            example: "First Term",
          },
          score: {
            type: "number",
            minimum: 0,
            maximum: 100,
            example: 92,
          },
          remarks: {
            type: "string",
            example: "Outstanding performance",
          },
        },
      },

      // =====================================
      // ANNOUNCEMENTS
      // =====================================

      AnnouncementCreateRequest: {
        type: "object",
        required: ["title", "message"],
        properties: {
          title: {
            type: "string",
            maxLength: 150,
            example: "Parent-Teacher Meeting",
          },
          message: {
            type: "string",
            maxLength: 2000,
            example:
              "The parent-teacher meeting will hold on Friday at 11:00 AM.",
          },
          audience: {
            type: "string",
            enum: ["all", "teachers", "students"],
            example: "all",
          },
          status: {
            type: "string",
            enum: ["draft", "published"],
            example: "published",
          },
        },
      },

      AnnouncementUpdateRequest: {
        type: "object",
        properties: {
          title: {
            type: "string",
            maxLength: 150,
            example: "Updated Parent-Teacher Meeting",
          },
          message: {
            type: "string",
            maxLength: 2000,
            example:
              "The parent-teacher meeting will hold on Friday at 11:00 AM.",
          },
          audience: {
            type: "string",
            enum: ["all", "teachers", "students"],
            example: "all",
          },
          status: {
            type: "string",
            enum: ["draft", "published"],
            example: "published",
          },
        },
      },
    },
  },

  paths: {
    // =====================================
    // AUTHENTICATION
    // =====================================

    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
          },
          400: {
            description: "Validation error",
          },
          409: {
            description: "Email already exists",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Invalid email or password",
          },
        },
      },
    },

    "/api/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current logged-in user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User profile retrieved successfully",
          },
          401: {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/auth/admin-test": {
      get: {
        tags: ["Authentication"],
        summary: "Test admin authorization",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Admin access granted",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Admin access required",
          },
        },
      },
    },

    // =====================================
    // USERS
    // =====================================

    "/api/users": {
      post: {
        tags: ["Users"],
        summary: "Create a new user",
        description:
          "Allows an authenticated administrator to create an admin, teacher or student user account.",
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUserRequest",
              },
            },
          },
        },

        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description:
              "Validation error. Required fields are missing, role is invalid, or password is less than 6 characters.",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Admin access required",
          },
          409: {
            description: "Email already exists",
          },
          500: {
            description: "Server error",
          },
        },
      },
    },

    // =====================================
    // STUDENTS
    // =====================================

    "/api/students": {
      post: {
        tags: ["Students"],
        summary: "Create a student",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StudentCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Student created successfully",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "User is not authorized",
          },
          409: {
            description: "Student already exists",
          },
        },
      },

      get: {
        tags: ["Students"],
        summary: "Get all students",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Students retrieved successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "User is not authorized",
          },
        },
      },
    },

    "/api/students/{id}": {
      get: {
        tags: ["Students"],
        summary: "Get a student by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbbf9092af4e92ea6098af",
          },
        ],
        responses: {
          200: {
            description: "Student retrieved successfully",
          },
          400: {
            description: "Invalid student ID",
          },
          404: {
            description: "Student not found",
          },
        },
      },

      patch: {
        tags: ["Students"],
        summary: "Update a student",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbbf9092af4e92ea6098af",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StudentUpdateRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Student updated successfully",
          },
          400: {
            description: "Validation error",
          },
          403: {
            description: "User is not authorized",
          },
          404: {
            description: "Student not found",
          },
        },
      },

      delete: {
        tags: ["Students"],
        summary: "Delete a student",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbbf9092af4e92ea6098af",
          },
        ],
        responses: {
          200: {
            description: "Student deleted successfully",
          },
          403: {
            description: "Only admin users can delete students",
          },
          404: {
            description: "Student not found",
          },
        },
      },
    },

    // =====================================
    // TEACHERS
    // =====================================

    "/api/teachers": {
      post: {
        tags: ["Teachers"],
        summary: "Create a teacher",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TeacherCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Teacher created successfully",
          },
          400: {
            description: "Validation error",
          },
          403: {
            description: "Only admin users can create teachers",
          },
        },
      },

      get: {
        tags: ["Teachers"],
        summary: "Get all teachers",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Teachers retrieved successfully",
          },
          401: {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/teachers/{id}": {
      get: {
        tags: ["Teachers"],
        summary: "Get teacher by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab92eec58f84c38bd59c48e",
          },
        ],
        responses: {
          200: {
            description: "Teacher retrieved successfully",
          },
          404: {
            description: "Teacher not found",
          },
        },
      },

      patch: {
        tags: ["Teachers"],
        summary: "Update teacher",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab92eec58f84c38bd59c48e",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TeacherUpdateRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Teacher updated successfully",
          },
          403: {
            description: "Only admin users can update teachers",
          },
          404: {
            description: "Teacher not found",
          },
        },
      },

      delete: {
        tags: ["Teachers"],
        summary: "Delete teacher",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab92eec58f84c38bd59c48e",
          },
        ],
        responses: {
          200: {
            description: "Teacher deleted successfully",
          },
          403: {
            description: "Only admin users can delete teachers",
          },
          404: {
            description: "Teacher not found",
          },
        },
      },
    },

    // =====================================
    // CLASSES
    // =====================================

    "/api/classes": {
      post: {
        tags: ["Classes"],
        summary: "Create a class",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ClassCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Class created successfully",
          },
          403: {
            description: "Only admin users can create classes",
          },
        },
      },

      get: {
        tags: ["Classes"],
        summary: "Get all classes",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Classes retrieved successfully",
          },
        },
      },
    },

    "/api/classes/{id}": {
      get: {
        tags: ["Classes"],
        summary: "Get class by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab936b2d301d6677d780c33",
          },
        ],
        responses: {
          200: {
            description: "Class retrieved successfully",
          },
          404: {
            description: "Class not found",
          },
        },
      },

      patch: {
        tags: ["Classes"],
        summary: "Update class",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab936b2d301d6677d780c33",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ClassUpdateRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Class updated successfully",
          },
          403: {
            description: "Only admin users can update classes",
          },
        },
      },

      delete: {
        tags: ["Classes"],
        summary: "Delete class",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab936b2d301d6677d780c33",
          },
        ],
        responses: {
          200: {
            description: "Class deleted successfully",
          },
          403: {
            description: "Only admin users can delete classes",
          },
        },
      },
    },

    // =====================================
    // SUBJECTS
    // =====================================

    "/api/subjects": {
      post: {
        tags: ["Subjects"],
        summary: "Create a subject",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SubjectCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Subject created successfully",
          },
          403: {
            description: "Only admin users can create subjects",
          },
        },
      },

      get: {
        tags: ["Subjects"],
        summary: "Get all subjects",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Subjects retrieved successfully",
          },
        },
      },
    },

    "/api/subjects/{id}": {
      get: {
        tags: ["Subjects"],
        summary: "Get subject by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab93b81a0dd642d61220e36",
          },
        ],
        responses: {
          200: {
            description: "Subject retrieved successfully",
          },
          404: {
            description: "Subject not found",
          },
        },
      },

      patch: {
        tags: ["Subjects"],
        summary: "Update subject",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab93b81a0dd642d61220e36",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SubjectUpdateRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Subject updated successfully",
          },
          403: {
            description: "Only admin users can update subjects",
          },
        },
      },

      delete: {
        tags: ["Subjects"],
        summary: "Delete subject",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab93b81a0dd642d61220e36",
          },
        ],
        responses: {
          200: {
            description: "Subject deleted successfully",
          },
          403: {
            description: "Only admin users can delete subjects",
          },
        },
      },
    },

    // =====================================
    // ATTENDANCE
    // =====================================

    "/api/attendance": {
      post: {
        tags: ["Attendance"],
        summary: "Record attendance",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/AttendanceCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Attendance recorded successfully",
          },
          400: {
            description: "Validation error",
          },
          409: {
            description:
              "Attendance already exists for this student on this date",
          },
        },
      },

      get: {
        tags: ["Attendance"],
        summary: "Get all attendance records",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description:
              "Attendance records retrieved successfully",
          },
        },
      },
    },

    "/api/attendance/student/{studentId}": {
      get: {
        tags: ["Attendance"],
        summary: "Get attendance by student",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "studentId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbbf9092af4e92ea6098af",
          },
        ],
        responses: {
          200: {
            description:
              "Student attendance retrieved successfully",
          },
          404: {
            description: "Student not found",
          },
        },
      },
    },

    "/api/attendance/class/{classId}": {
      get: {
        tags: ["Attendance"],
        summary: "Get attendance by class",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "classId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab936b2d301d6677d780c33",
          },
        ],
        responses: {
          200: {
            description:
              "Class attendance retrieved successfully",
          },
          404: {
            description: "Class not found",
          },
        },
      },
    },

    // =====================================
    // RESULTS
    // =====================================

    "/api/results": {
      post: {
        tags: ["Results"],
        summary: "Record a student result",
        description:
          "Records a result. Grade is calculated automatically from the score.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResultCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Result recorded successfully",
          },
          400: {
            description: "Validation error",
          },
          409: {
            description:
              "A result already exists for this student, subject, session and term",
          },
        },
      },

      get: {
        tags: ["Results"],
        summary: "Get all results",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Results retrieved successfully",
          },
        },
      },
    },

    "/api/results/student/{studentId}": {
      get: {
        tags: ["Results"],
        summary: "Get results by student",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "studentId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbbf9092af4e92ea6098af",
          },
        ],
        responses: {
          200: {
            description:
              "Student results retrieved successfully",
          },
          404: {
            description: "Student not found",
          },
        },
      },
    },

    "/api/results/class/{classId}": {
      get: {
        tags: ["Results"],
        summary: "Get results by class",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "classId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6ab936b2d301d6677d780c33",
          },
        ],
        responses: {
          200: {
            description:
              "Class results retrieved successfully",
          },
          404: {
            description: "Class not found",
          },
        },
      },
    },

    "/api/results/{id}": {
      get: {
        tags: ["Results"],
        summary: "Get result by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbe29fc00ae035ee20a2c9",
          },
        ],
        responses: {
          200: {
            description:
              "Result retrieved successfully",
          },
          404: {
            description: "Result not found",
          },
        },
      },

      patch: {
        tags: ["Results"],
        summary: "Update result",
        description:
          "Updates a result. Grade is recalculated automatically.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbe29fc00ae035ee20a2c9",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResultUpdateRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Result updated successfully",
          },
          403: {
            description:
              "Only admin users can update results",
          },
        },
      },

      delete: {
        tags: ["Results"],
        summary: "Delete result",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abbe29fc00ae035ee20a2c9",
          },
        ],
        responses: {
          200: {
            description:
              "Result deleted successfully",
          },
          403: {
            description:
              "Only admin users can delete results",
          },
        },
      },
    },

    // =====================================
    // ANNOUNCEMENTS
    // =====================================

    "/api/announcements": {
      post: {
        tags: ["Announcements"],
        summary: "Create an announcement",
        description:
          "Creates a school announcement. Only admin users can create announcements.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/AnnouncementCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description:
              "Announcement created successfully",
          },
          400: {
            description:
              "Validation error",
          },
          403: {
            description:
              "Only admin users can create announcements",
          },
        },
      },

      get: {
        tags: ["Announcements"],
        summary: "Get all announcements",
        description:
          "Returns announcements available to the authenticated user's role and audience.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description:
              "Announcements retrieved successfully",
          },
          401: {
            description:
              "Authentication required",
          },
        },
      },
    },

    "/api/announcements/{id}": {
      get: {
        tags: ["Announcements"],
        summary: "Get announcement by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abe5723c1017ef7ab19441e",
          },
        ],
        responses: {
          200: {
            description:
              "Announcement retrieved successfully",
          },
          403: {
            description:
              "User is not authorized to view this announcement",
          },
          404: {
            description:
              "Announcement not found",
          },
        },
      },

      patch: {
        tags: ["Announcements"],
        summary: "Update announcement",
        description:
          "Updates an announcement. Only admin users can update announcements.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abe5723c1017ef7ab19441e",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/AnnouncementUpdateRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "Announcement updated successfully",
          },
          403: {
            description:
              "Only admin users can update announcements",
          },
          404: {
            description:
              "Announcement not found",
          },
        },
      },

      delete: {
        tags: ["Announcements"],
        summary: "Delete announcement",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "6abe5723c1017ef7ab19441e",
          },
        ],
        responses: {
          200: {
            description:
              "Announcement deleted successfully",
          },
          403: {
            description:
              "Only admin users can delete announcements",
          },
          404: {
            description:
              "Announcement not found",
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;