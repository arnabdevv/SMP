# SMP Backend

## Overview

This is the backend for the School Management Platform (SMP). It is built with Node.js, Express, and MongoDB. The backend provides RESTful APIs for managing admins, students, teachers, classes, and batches.

---

## Environment & Requirements

- **Node.js** v16 or higher
- **MongoDB** (local or cloud instance)
- **npm** (Node Package Manager)

---

## Project Structure

```
backend/
├── app.js                # Main entry point
├── config/               # Database connection
├── controllers/          # Route controllers
├── middleware/           # Auth and role middleware
├── models/               # Mongoose models
├── router/               # Express routers
└── utils/                # Utility functions
```

---

## Setup Instructions

1. **Clone the repository** (if not already):
   ```sh
   git clone <repo-url>
   cd SMP/backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure MongoDB:**
   - Edit `config/mongooseConnection.js` to set your MongoDB URI.
4. **Start the backend server:**
   ```sh
   node app.js
   ```

---

## Main Dependencies

- express
- mongoose
- bcrypt
- jsonwebtoken
- cookie-parser

---

## API Routers

Each router file in `backend/router/` contains inline comments above each route describing its path and purpose. Example:

```js
// POST  /register     - Register a new admin
router.post("/register", registerAdmin);
```

**Routers:**

- `adminRouter.js` — Admin authentication and dashboard
- `batchRouter.js` — Batch management
- `classRouter.js` — Class management
- `studentRouter.js` — Student registration and management
- `teacherRouter.js` — Teacher authentication and dashboard

---

## API Usage

- All API endpoints are prefixed with `/api/{resource}` (e.g., `/api/admin/login`).
- Authentication is handled via JWT tokens stored in HTTP-only cookies.
- See each router file for available endpoints and required request bodies.

---

## Contributing

1. Fork the repository and create a new branch for your feature or bugfix.
2. Make your changes and ensure code quality.
3. Submit a pull request with a clear description of your changes.

---

## Contact

For any queries or issues, please contact the backend maintainer or open an issue on the repository.
