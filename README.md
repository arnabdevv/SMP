# SMP - School Management Platform

A comprehensive full-stack web application for managing school operations with role-based access control for Admins, Teachers, and Students.

## 📋 Overview

SMP (School Management Platform) is designed to streamline school administration by providing dedicated interfaces for different user roles. The platform handles user management, class and batch organization, and provides role-specific dashboards with tailored functionality.

## 🏗️ Architecture

- **Backend**: Node.js/Express REST API with MongoDB
- **Frontend**: React 19 with Vite, Tailwind CSS, and shadcn/ui components
- **Authentication**: JWT-based authentication with role-based authorization
- **Database**: MongoDB with Mongoose ODM

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT token-based authentication
- Role-based access control (Admin, Teacher, Student)
- Secure password hashing with bcrypt
- Protected routes with middleware validation
- Session management with HTTP-only cookies

### 👨‍💼 Admin Features
- Complete user management (Teachers, Students)
- Class and batch creation and management
- Bulk student registration
- Dashboard with system statistics
- Teacher assignment and oversight

### 👨‍🏫 Teacher Features
- Dedicated teacher dashboard
- Student management for assigned classes
- View students by class and batch
- Exam management interface
- Class-specific operations

### 👨‍🎓 Student Features
- Personalized student dashboard
- Class and batch information
- Profile management
- Academic information access

### 📚 Academic Management
- Class creation and management
- Batch organization within classes
- Student-class-batch relationships
- Hierarchical academic structure

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.16.1
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.2)
- **Security**: bcrypt 6.0.0 for password hashing
- **Middleware**: CORS, cookie-parser, express-session
- **Utilities**: dotenv for environment configuration

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 7.8.2 + Wouter 3.7.1
- **Styling**: Tailwind CSS 3.4.17 with tailwindcss-animate
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Handling**: React Hook Form 7.62.0 with Zod 4.1.5 validation
- **State Management**: React Context + TanStack React Query 5.87.1
- **HTTP Client**: Axios 1.12.2
- **Notifications**: React Toastify 11.0.5

## 📁 Project Structure

```
SMP/
├── backend/
│   ├── app.js                    # Express application entry point
│   ├── config/
│   │   └── mongooseConnection.js # MongoDB connection configuration
│   ├── controllers/
│   │   ├── auth/                 # Authentication controllers
│   │   ├── common/               # Common controllers
│   │   └── features/             # Feature-specific controllers
│   ├── middleware/
│   │   ├── isAuthenticated.js    # JWT authentication middleware
│   │   └── authorizeRole.js      # Role-based authorization
│   ├── models/
│   │   ├── adminModel.js         # Admin user schema
│   │   ├── teacherModel.js       # Teacher user schema
│   │   ├── studentModel.js       # Student user schema
│   │   ├── classModel.js         # Class schema
│   │   └── batchModel.js         # Batch schema
│   ├── router/
│   │   ├── adminRouter.js        # Admin routes
│   │   ├── teacherRouter.js      # Teacher routes
│   │   ├── studentRouter.js      # Student routes
│   │   ├── classRouter.js        # Class management routes
│   │   └── batchRouter.js        # Batch management routes
│   ├── utils/                    # Utility functions
│   ├── ROUTES.md                 # Detailed API documentation
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # Application entry point
│   │   ├── App.jsx               # Root component with routing
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   ├── ProtectedRoute.jsx # Route protection HOC
│   │   │   └── TeacherSidebar.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # Authentication state management
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page for all roles
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── ManageTeachers.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   ├── ManageClasses.jsx
│   │   │   ├── ManageBatches.jsx
│   │   │   ├── TeacherStudentManagement.jsx
│   │   │   └── TeacherExamManagement.jsx
│   │   ├── services/             # API service layer
│   │   └── hooks/                # Custom React hooks
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SMP
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   node app.js
   ```
   Server will run on `http://localhost:3000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

## 📖 API Documentation

For comprehensive API documentation including all endpoints, request/response formats, and authentication details, see:

- **[backend/ROUTES.md](backend/ROUTES.md)** - Complete API routes documentation
- **[backend/README.md](backend/README.md)** - Backend-specific documentation

### Quick API Reference

| Route Prefix | Description        | File                    |
|--------------|--------------------|-----------------------|
| `/admin`     | Admin operations   | `router/adminRouter.js` |
| `/teacher`   | Teacher operations | `router/teacherRouter.js` |
| `/student`   | Student operations | `router/studentRouter.js` |
| `/class`     | Class management   | `router/classRouter.js` |
| `/batch`     | Batch management   | `router/batchRouter.js` |

## 🔑 Default Login Credentials

After initial setup, you can register an admin account using:

```bash
POST http://localhost:3000/admin/register
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "your_password"
}
```

Then login with the same credentials through the application.

## 🐛 Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Verify your `MONGO_URI` in `.env` is correct
- **Port Already in Use**: Change the `PORT` in `.env` or stop the conflicting process
- **JWT Errors**: Ensure `JWT_SECRET` is set in `.env`

### Frontend Issues

- **CORS Errors**: Verify backend CORS configuration allows `http://localhost:5173`
- **Build Errors**: Clear `node_modules` and reinstall dependencies
- **Routing Issues**: Ensure backend is running on the expected port (3000)

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📧 Contact

For any queries or issues, please contact the project maintainer.
