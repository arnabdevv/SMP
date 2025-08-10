# Backend Documentation

This document provides a comprehensive overview of the backend for the School Management Platform. It includes details on setting up the environment, API endpoints, data models, and authentication.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Admin](#admin)
  - [Teacher](#teacher)
  - [Student](#student)
  - [Class](#class)
  - [Batch](#batch)
- [Database Models](#database-models)
  - [Admin Model](#admin-model)
  - [Teacher Model](#teacher-model)
  - [Student Model](#student-model)
  - [Class Model](#class-model)
  - [Batch Model](#batch-model)
- [Authentication](#authentication)

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1.  Clone the repository.
2.  Navigate to the `backend` directory.
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the `backend` directory and add the following environment variables:
    ```
    PORT=3000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

### Running the Application

```bash
npm start
```

## API Endpoints

### Admin

- **Register a new admin**
  - **Method:** `POST`
  - **Endpoint:** `/admin/register`
  - **Request Body:**
    ```json
    {
      "fullName": "Admin User",
      "email": "admin@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Admin Register Successful"
    }
    ```

- **Admin login**
  - **Method:** `POST`
  - **Endpoint:** `/admin/login`
  - **Request Body:**
    ```json
    {
      "email": "admin@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Login Successful",
      "token": "your_jwt_token"
    }
    ```

- **Admin logout**
  - **Method:** `GET`
  - **Endpoint:** `/admin/logout`
  - **Response:**
    ```json
    {
      "message": "Logout Successfully"
    }
    ```

- **Get admin dashboard data**
  - **Method:** `GET`
  - **Endpoint:** `/admin/dashboard`
  - **Response:**
    ```json
    {
      "message": "Welcome to the dashboard",
      "user": {
        "fullName": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
      }
    }
    ```

### Teacher

- **Register a new teacher**
  - **Method:** `POST`
  - **Endpoint:** `/teacher/register`
  - **Request Body:**
    ```json
    {
      "fullName": "Teacher User",
      "email": "teacher@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Teacher Register Successful"
    }
    ```

- **Teacher login**
  - **Method:** `POST`
  - **Endpoint:** `/teacher/login`
  - **Request Body:**
    ```json
    {
      "email": "teacher@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Login Successful",
      "token": "your_jwt_token"
    }
    ```

- **Teacher logout**
  - **Method:** `GET`
  - **Endpoint:** `/teacher/logout`
  - **Response:**
    ```json
    {
      "message": "Logout Successfully"
    }
    ```

- **Get teacher dashboard data**
  - **Method:** `GET`
  - **Endpoint:** `/teacher/dashboard`
  - **Response:**
    ```json
    {
      "message": "Welcome to the dashboard",
      "user": {
        "fullName": "Teacher User",
        "email": "teacher@example.com",
        "role": "teacher"
      }
    }
    ```

### Student

- **Register a new student**
  - **Method:** `POST`
  - **Endpoint:** `/student/register`
  - **Request Body:**
    ```json
    {
      "fullName": "Student User",
      "email": "student@example.com",
      "password": "password123",
      "class": "60d5f1b3e6b3a1b4e8b0e1b2",
      "batch": "60d5f1b3e6b3a1b4e8b0e1b3"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Student Register Successful"
    }
    ```

- **Student login**
  - **Method:** `POST`
  - **Endpoint:** `/student/login`
  - **Request Body:**
    ```json
    {
      "email": "student@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Login Successful",
      "token": "your_jwt_token"
    }
    ```

- **Register students in bulk**
  - **Method:** `POST`
  - **Endpoint:** `/student/bulkRegistration`
  - **Request Body:**
    ```json
    {
      "students": [
        {
          "fullName": "Student One",
          "email": "student1@example.com",
          "password": "password123",
          "class": "60d5f1b3e6b3a1b4e8b0e1b2",
          "batch": "60d5f1b3e6b3a1b4e8b0e1b3"
        },
        {
          "fullName": "Student Two",
          "email": "student2@example.com",
          "password": "password456",
          "class": "60d5f1b3e6b3a1b4e8b0e1b2",
          "batch": "60d5f1b3e6b3a1b4e8b0e1b3"
        }
      ]
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Bulk registration successful"
    }
    ```

- **Student logout**
  - **Method:** `GET`
  - **Endpoint:** `/student/logout`
  - **Response:**
    ```json
    {
      "message": "Logout Successfully"
    }
    ```

- **Get student dashboard data**
  - **Method:** `GET`
  - **Endpoint:** `/student/dashboard`
  - **Response:**
    ```json
    {
      "message": "Welcome to the dashboard",
      "user": {
        "fullName": "Student User",
        "email": "student@example.com",
        "role": "student"
      }
    }
    ```

- **Get students by class and batch**
  - **Method:** `GET`
  - **Endpoint:** `/student/list?classId=60d5f1b3e6b3a1b4e8b0e1b2&batchId=60d5f1b3e6b3a1b4e8b0e1b3`
  - **Response:**
    ```json
    {
      "students": [
        {
          "_id": "60d5f1b3e6b3a1b4e8b0e1b4",
          "fullName": "Student One",
          "email": "student1@example.com",
          "class": "60d5f1b3e6b3a1b4e8b0e1b2",
          "batch": "60d5f1b3e6b3a1b4e8b0e1b3"
        }
      ]
    }
    ```

### Class

- **Create a new class**
  - **Method:** `POST`
  - **Endpoint:** `/class/create`
  - **Request Body:**
    ```json
    {
      "name": "Class 10"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Class created successfully",
      "class": {
        "_id": "60d5f1b3e6b3a1b4e8b0e1b2",
        "name": "Class 10"
      }
    }
    ```

- **Get all classes**
  - **Method:** `GET`
  - **Endpoint:** `/class/all`
  - **Response:**
    ```json
    {
      "classes": [
        {
          "_id": "60d5f1b3e6b3a1b4e8b0e1b2",
          "name": "Class 10"
        }
      ]
    }
    ```

### Batch

- **Create a new batch**
  - **Method:** `POST`
  - **Endpoint:** `/batch/create`
  - **Request Body:**
    ```json
    {
      "name": "Section A",
      "classId": "60d5f1b3e6b3a1b4e8b0e1b2"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Batch created successfully",
      "batch": {
        "_id": "60d5f1b3e6b3a1b4e8b0e1b3",
        "name": "Section A",
        "class": "60d5f1b3e6b3a1b4e8b0e1b2"
      }
    }
    ```

## Database Models

### Admin Model

```javascript
{
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String,
    default: "admin",
  },
}
```

### Teacher Model

```javascript
{
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String,
    default: "teacher",
  },
}
```

### Student Model

```javascript
{
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String,
    default: "student",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
}
```

### Class Model

```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
  },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
}
```

### Batch Model

```javascript
{
  name: {
    type: String,
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
}
```

## Authentication

Authentication is handled using JSON Web Tokens (JWT). When a user logs in, a token is generated and sent back in a cookie. This token is then used to authenticate subsequent requests. The `isAuthenticated` middleware is used to protect routes that require authentication. The `authorizeRole` middleware is used to restrict access to certain roles.
