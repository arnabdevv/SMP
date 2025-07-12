# SMP Project

## Overview

SMP (School Management Platform) is a full-stack web application designed to manage school operations, including administration, student and teacher management, class and batch management, and more. The project is divided into two main parts:

- **Backend**: Node.js/Express REST API
- **Frontend**: React.js (with Vite, Tailwind CSS)

---

## Backend

- **Location**: `backend/`
- **Main Entry**: `backend/app.js`
- **Configuration**: `backend/config/mongooseConnection.js` (MongoDB connection)
- **Models**: Located in `backend/models/`
- **Controllers**: Located in `backend/controllers/`
- **Middleware**: Located in `backend/middleware/`
- **Routes**: Located in `backend/router/`
- **Utils**: Located in `backend/utils/`

### Main Routes

| Route Prefix   | File                      | Description        |
| -------------- | ------------------------- | ------------------ |
| `/api/admin`   | `router/adminRouter.js`   | Admin operations   |
| `/api/batch`   | `router/batchRouter.js`   | Batch management   |
| `/api/class`   | `router/classRouter.js`   | Class management   |
| `/api/student` | `router/studentRouter.js` | Student management |
| `/api/teacher` | `router/teacherRouter.js` | Teacher management |

#### Example Admin Auth Endpoints

- `POST /api/admin/register` — Register a new admin
- `POST /api/admin/login` — Admin login
- `POST /api/admin/logout` — Admin logout

---

## Frontend

- **Location**: `frontend/`
- **Main Entry**: `frontend/src/main.jsx`
- **Components**: Located in `frontend/src/components/`
- **Contexts**: Located in `frontend/src/contexts/`
- **Styling**: Tailwind CSS (`frontend/index.css`, `tailwind.config.js`)
- **Vite Config**: `frontend/vite.config.js`

---

## Setup Instructions

### Backend

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your MongoDB connection in `config/mongooseConnection.js`.
4. Start the backend server:
   ```sh
   node app.js
   ```

### Frontend

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

---

## Project Structure

```
SMP/
├── backend/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── router/
│   └── utils/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── ...
└── README.md
```

---

## Contact

For any queries or issues, please contact the project maintainer.
