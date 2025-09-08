# API Routes Documentation

This document provides a detailed list of all API routes available in the School Management Platform.

## Base URL

All API routes are prefixed with `/api`

## Authentication Routes

### Admin Authentication

| Method | Endpoint           | Description        | Auth Required | Role Required |
| ------ | ------------------ | ------------------ | ------------- | ------------- |
| GET    | `/admin/`          | Test route         | No            | None          |
| POST   | `/admin/register`  | Register new admin | No            | None          |
| POST   | `/admin/login`     | Admin login        | No            | None          |
| GET    | `/admin/logout`    | Admin logout       | No            | None          |
| GET    | `/admin/dashboard` | Admin dashboard    | Yes           | Admin         |

### Teacher Authentication

| Method | Endpoint                  | Description          | Auth Required | Role Required |
| ------ | ------------------------- | -------------------- | ------------- | ------------- |
| GET    | `/teacher/`               | Test route           | No            | None          |
| POST   | `/teacher/register`       | Register new teacher | No            | None          |
| POST   | `/teacher/login`          | Teacher login        | No            | None          |
| GET    | `/teacher/logout`         | Teacher logout       | No            | None          |
| GET    | `/teacher/dashboard`      | Teacher dashboard    | Yes           | Teacher       |
| GET    | `/teacher/getAllTeachers` | Get all teachers     | Yes           | Admin         |

### Student Authentication

| Method | Endpoint                    | Description                 | Auth Required | Role Required  |
| ------ | --------------------------- | --------------------------- | ------------- | -------------- |
| GET    | `/student/`                 | Test route                  | No            | None           |
| POST   | `/student/register`         | Register new student        | Yes           | Admin, Teacher |
| POST   | `/student/login`            | Student login               | No            | None           |
| GET    | `/student/logout`           | Student logout              | No            | None           |
| GET    | `/student/dashboard`        | Student dashboard           | Yes           | Student        |
| POST   | `/student/bulkRegistration` | Register multiple students  | Yes           | Admin, Teacher |
| GET    | `/student/list`             | Get students by class/batch | Yes           | Admin, Teacher |

## Class Management

| Method | Endpoint        | Description                  | Auth Required | Role Required |
| ------ | --------------- | ---------------------------- | ------------- | ------------- |
| GET    | `/class/`       | Test route                   | No            | None          |
| POST   | `/class/create` | Create new class             | No            | None          |
| GET    | `/class/all`    | Get all classes with batches | No            | None          |

## Batch Management

| Method | Endpoint        | Description      | Auth Required | Role Required |
| ------ | --------------- | ---------------- | ------------- | ------------- |
| GET    | `/batch/`       | Test route       | No            | None          |
| POST   | `/batch/create` | Create new batch | No            | None          |

## Request/Response Examples

### Admin Routes

#### Register Admin

```http
POST /api/admin/register
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Admin Login

```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Teacher Routes

#### Register Teacher

```http
POST /api/teacher/register
Content-Type: application/json

{
  "fullName": "Teacher Name",
  "email": "teacher@example.com",
  "password": "password123"
}
```

### Student Routes

#### Register Student

```http
POST /api/student/register
Content-Type: application/json
Authorization: Bearer <token>

{
  "fullName": "Student Name",
  "email": "student@example.com",
  "password": "password123",
  "class": "classId",
  "batch": "batchId"
}
```

#### Bulk Register Students

```http
POST /api/student/bulkRegistration
Content-Type: application/json
Authorization: Bearer <token>

{
  "students": [
    {
      "fullName": "Student 1",
      "email": "student1@example.com",
      "password": "password123",
      "class": "classId",
      "batch": "batchId"
    },
    {
      "fullName": "Student 2",
      "email": "student2@example.com",
      "password": "password123",
      "class": "classId",
      "batch": "batchId"
    }
  ]
}
```

### Class Routes

#### Create Class

```http
POST /api/class/create
Content-Type: application/json

{
  "name": "Class Name",
  "description": "Class Description"
}
```

### Batch Routes

#### Create Batch

```http
POST /api/batch/create
Content-Type: application/json

{
  "name": "Batch Name",
  "description": "Batch Description",
  "classId": "Class ID"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, you'll receive a token that should be included in the Authorization header for protected routes:

```http
Authorization: Bearer <your_jwt_token>
```

## Error Responses

The API returns appropriate HTTP status codes along with error messages:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Example error response:

```json
{
  "error": "Error message description"
}
```
