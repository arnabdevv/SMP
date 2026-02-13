# School Management Platform - Backend

## Overview

The backend of the School Management Platform provides a secure, role-based REST API using Node.js, Express, and MongoDB. It implements comprehensive authentication and authorization mechanisms with JWT tokens, enabling role-specific access control for Admins, Teachers, and Students.

## 🏗️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM 8.16.1
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.2)
- **Security**: bcrypt 6.0.0 for password hashing
- **Middleware**: 
  - CORS 2.8.5 for cross-origin requests
  - cookie-parser 1.4.7 for cookie handling
  - express-session 1.18.1 for session management
  - connect-flash 0.1.1 for flash messages
- **Environment**: dotenv 17.2.3 for configuration

## ✨ Features

### 🔐 Authentication
- Role-based authentication (Admin/Teacher/Student)
- JWT token implementation with HTTP-only cookies
- Secure password hashing with bcrypt
- Session management
- Token verification middleware

### 🛡️ Authorization
- Role-based middleware protection (`authorizeRole`)
- Route-specific access control
- Token verification (`isAuthenticated`)
- Role verification for API endpoints

### 📚 API Features

#### User Management
- Admin registration and management
- Teacher registration and management
- Student registration and management
- Bulk student registration
- User authentication and authorization

#### Academic Management
- Class creation and management
- Batch creation and organization
- Class-batch hierarchical relationships
- Student assignment to classes and batches

#### Dashboard Data
- Role-specific dashboard endpoints
- User profile information
- Statistics and analytics

## 📁 Project Structure

```
backend/
├── app.js                        # Express application entry point
├── logger.js                     # Application logging utility
├── config/
│   └── mongooseConnection.js     # MongoDB connection setup
├── controllers/
│   ├── auth/                     # Authentication controllers
│   │   ├── adminController.js    # Admin auth logic
│   │   ├── teacherController.js  # Teacher auth logic
│   │   └── studentController.js  # Student auth logic
│   ├── common/                   # Common controllers
│   │   ├── classController.js    # Class management
│   │   ├── batchController.js    # Batch management
│   │   └── dashboardController.js
│   └── features/                 # Feature-specific controllers
├── middleware/
│   ├── isAuthenticated.js        # JWT authentication middleware
│   └── authorizeRole.js          # Role-based authorization middleware
├── models/
│   ├── adminModel.js             # Admin user schema
│   ├── teacherModel.js           # Teacher user schema
│   ├── studentModel.js           # Student user schema
│   ├── classModel.js             # Class schema
│   └── batchModel.js             # Batch schema
├── router/
│   ├── adminRouter.js            # Admin routes
│   ├── teacherRouter.js          # Teacher routes
│   ├── studentRouter.js          # Student routes
│   ├── classRouter.js            # Class management routes
│   └── batchRouter.js            # Batch management routes
├── utils/                        # Utility functions
│   └── generateToken.js          # JWT token generation
├── .env                          # Environment variables (not committed)
├── ROUTES.md                     # Detailed API documentation
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   **Environment Variables Explained**:
   - `PORT`: Port number for the server (default: 3000)
   - `MONGO_URI`: MongoDB connection string (local or Atlas)
   - `JWT_SECRET`: Secret key for JWT token signing (use a strong, random string)

### Running the Application

#### Development Mode
```bash
node app.js
```

The server will start on `http://localhost:3000` (or your configured PORT).

#### Using nodemon (Auto-restart on changes)
```bash
npm install -g nodemon
nodemon app.js
```

## 📖 API Routes

All API routes are accessible at `http://localhost:3000`. Here's a quick reference:

### Route Prefixes

| Prefix     | Description        | Router File              |
|------------|--------------------|-----------------------------|
| `/admin`   | Admin operations   | `router/adminRouter.js`   |
| `/teacher` | Teacher operations | `router/teacherRouter.js` |
| `/student` | Student operations | `router/studentRouter.js` |
| `/class`   | Class management   | `router/classRouter.js`   |
| `/batch`   | Batch management   | `router/batchRouter.js`   |

### Quick Endpoint Reference

#### Admin Routes
- `POST /admin/register` - Register new admin
- `POST /admin/login` - Admin login
- `GET /admin/logout` - Admin logout
- `GET /admin/dashboard` - Admin dashboard (Auth: Admin)

#### Teacher Routes
- `POST /teacher/register` - Register new teacher
- `POST /teacher/login` - Teacher login
- `GET /teacher/logout` - Teacher logout
- `GET /teacher/dashboard` - Teacher dashboard (Auth: Teacher)
- `GET /teacher/getAllTeachers` - Get all teachers (Auth: Admin)

#### Student Routes
- `POST /student/register` - Register student (Auth: Admin/Teacher)
- `POST /student/login` - Student login
- `GET /student/logout` - Student logout
- `GET /student/dashboard` - Student dashboard (Auth: Student)
- `POST /student/bulkRegistration` - Bulk register students (Auth: Admin/Teacher)
- `GET /student/list` - Get students by class/batch (Auth: Admin/Teacher)

#### Class Routes
- `POST /class/create` - Create new class
- `GET /class/all` - Get all classes with batches

#### Batch Routes
- `POST /batch/create` - Create new batch
- `GET /batch/all` - Get all batches

**For complete API documentation with request/response examples, see [ROUTES.md](ROUTES.md)**

## 🗄️ Database Models

### Admin Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profileImage: String,
  role: String (default: "admin")
}
```

### Teacher Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profileImage: String,
  role: String (default: "teacher")
}
```

### Student Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profileImage: String,
  role: String (default: "student"),
  class: ObjectId (ref: "Class"),
  batch: ObjectId (ref: "Batch")
}
```

### Class Model
```javascript
{
  name: String (required, unique),
  batches: [ObjectId] (ref: "Batch")
}
```

### Batch Model
```javascript
{
  name: String (required),
  class: ObjectId (ref: "Class", required)
}
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Tokens are signed and verified using a secret key
- **HTTP-only Cookies**: Tokens stored in secure cookies to prevent XSS
- **Role-based Authorization**: Middleware validates user roles for protected routes
- **CORS Configuration**: Configured to allow requests from frontend (`http://localhost:5173`)
- **Input Validation**: Request data validation before processing

## 🛠️ Middleware

### Authentication Middleware
- **isAuthenticated**: Verifies JWT token from cookies
  - Location: `middleware/isAuthenticated.js`
  - Usage: Protects routes requiring authentication

### Authorization Middleware
- **authorizeRole**: Validates user has required role
  - Location: `middleware/authorizeRole.js`
  - Usage: `authorizeRole(['admin', 'teacher'])`
  - Restricts access to specific user roles

## 🔧 Configuration

### CORS Setup
The backend is configured to accept requests from the frontend at `http://localhost:5173`:

```javascript
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
```

For production, update the origin to your deployed frontend URL.

### MongoDB Connection
Configure your MongoDB connection in `config/mongooseConnection.js`. The connection string is loaded from the `MONGO_URI` environment variable.

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB service is running (if using local MongoDB)
- Verify network access if using MongoDB Atlas

**JWT Token Errors**
- Ensure `JWT_SECRET` is set in `.env`
- Verify token is being sent in cookies
- Check token expiration settings

**CORS Errors**
- Verify frontend URL in CORS configuration
- Ensure `credentials: true` is set
- Check frontend is sending credentials with requests

**Port Already in Use**
- Change `PORT` in `.env`
- Kill the process using port 3000: `npx kill-port 3000`

**Authentication Failing**
- Check `isAuthenticated` middleware is properly applied
- Verify token is being generated and stored in cookies
- Check token verification logic

## 📝 Development Guidelines

### Adding New Routes
1. Create controller in appropriate directory under `controllers/`
2. Create router in `router/` directory
3. Import and mount router in `app.js`
4. Apply authentication/authorization middleware as needed
5. Update `ROUTES.md` with new endpoint documentation

### Adding New Models
1. Create model file in `models/` directory
2. Define schema with Mongoose
3. Export model for use in controllers
4. Update this README with model structure

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

## 🔗 Related Documentation

- [Root README](../README.md) - Overall project documentation
- [ROUTES.md](ROUTES.md) - Complete API endpoint documentation
- [Frontend README](../frontend/README.md) - Frontend documentation

---

For questions or issues, please contact the project maintainer.
