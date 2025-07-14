# SMP Frontend

## Overview

This is the frontend for the School Management Platform (SMP). It is a React + Vite + Tailwind CSS application for managing school operations, including students, teachers, classes, exams, fees, and more. The codebase is modular, scalable, and uses React Context for state management.

---

## Tech Stack

- **Framework:** React (JSX)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM (if present)
- **State Management:** React Context API
- **Icons:** lucide-react
- **Linting:** ESLint

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Admin/         # Admin dashboard & management
│   │   ├── Auth/          # Login/authentication
│   │   ├── Common/        # Shared UI (DataTable, Modal, StatsCard)
│   │   ├── Layout/        # Header, Sidebar, Layout wrappers
│   │   ├── Student/       # Student dashboard
│   │   └── Teacher/       # Teacher dashboard & features
│   ├── contexts/          # Global state (Auth, Data, Language)
│   ├── App.jsx            # Main app, routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind/global styles
├── types/                 # JS type definitions
├── index.html             # HTML template
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
└── eslint.config.js       # ESLint config
```

---

## Routing: Pages, Components, and Contexts

| Route                 | Page/Component                 | Description                                 | Contexts Used                    |
| --------------------- | ------------------------------ | ------------------------------------------- | -------------------------------- |
| `/login`              | `Auth/Login.jsx`               | Login page for all users                    | `AuthContext`                    |
| `/admin/dashboard`    | `Admin/AdminDashboard.jsx`     | Admin dashboard (stats, quick actions, etc) | `DataContext`, `LanguageContext` |
| `/admin/classes`      | `Admin/ClassManagement.jsx`    | Manage classes                              | `DataContext`                    |
| `/admin/fees`         | `Admin/FeeRecords.jsx`         | Manage/view fee records                     | `DataContext`                    |
| `/admin/students`     | `Admin/StudentManagement.jsx`  | Manage students                             | `DataContext`                    |
| `/admin/teachers`     | `Admin/TeacherManagement.jsx`  | Manage teachers                             | `DataContext`                    |
| `/student/dashboard`  | `Student/StudentDashboard.jsx` | Student dashboard                           | `DataContext`                    |
| `/teacher/dashboard`  | `Teacher/TeacherDashboard.jsx` | Teacher dashboard                           | `DataContext`                    |
| `/teacher/exams`      | `Teacher/ExamManagement.jsx`   | Manage/view exams                           | `DataContext`                    |
| `/teacher/attendance` | `Teacher/Attendance.jsx`       | Mark/view attendance                        | `DataContext`                    |
| `/teacher/students`   | `Teacher/StudentList.jsx`      | List of students for teacher                | `DataContext`                    |

**Layout Components:**

- `Layout/Layout.jsx` or `Layout/Layout.tsx`: Main layout wrapper for all pages (header/sidebar)
- `Layout/Header.jsx`: Top navigation bar
- `Layout/Sidebar.jsx`: Sidebar navigation

**Common Components:**

- `Common/DataTable.jsx`: Used in management/listing pages (students, teachers, fees, etc.)
- `Common/Modal.jsx`: Used for popups/forms
- `Common/StatsCard.jsx`: Used in dashboards for stats

**Contexts:**

- `AuthContext.jsx`: Handles authentication state, user info, login/logout
- `DataContext.jsx`: Provides all app data (students, teachers, classes, fees, exams, etc.)
- `LanguageContext.jsx`: Handles language/i18n (translations)

---

## How Contexts Are Used

- **AuthContext**: Used in `Login.jsx`, and in layout/components to check user role, protect routes, and handle logout.
- **DataContext**: Used in all dashboard and management pages to fetch and provide data (students, teachers, classes, fees, exams, etc.).
- **LanguageContext**: Used in all components for translations (e.g., `t('dashboard.welcome')`).

---

## Key Features

- **Role-based Dashboards:** Admin, Teacher, and Student each have their own dashboard and management pages.
- **Authentication:** Login system with context-based state.
- **Data Management:** CRUD for students, teachers, classes, fees, and exams.
- **Reusable UI:** DataTable, Modal, StatsCard, etc.
- **Responsive Design:** Tailwind CSS for mobile-friendly layouts.
- **i18n Support:** LanguageContext for translations.

---

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at http://localhost:5173
3. Build for production:
   ```sh
   npm run build
   ```
4. Preview the production build:
   ```sh
   npm run preview
   ```
5. Lint the code:
   ```sh
   npm run lint
   ```

---

## Customization & Extension

- **Add new pages/components:** Place them in the appropriate folder under `src/components/` and add a route in `App.jsx`.
- **Add new context/global state:** Create a new file in `src/contexts/` and provide it in `main.jsx`.
- **Change dashboard stats:** Edit `AdminDashboard.jsx` and update logic in `DataContext.jsx`.
- **Change language/i18n:** Update `LanguageContext.jsx` and translation files (if any).
- **Update styles:** Edit `index.css` or Tailwind config.

---

## Useful Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

---

## Notes

- The frontend expects a backend API (see `backend/` folder) for data. Update API endpoints in context or data files as needed.
- For authentication and protected routes, see `AuthContext.jsx` (frontend) and `roleMiddleware.js` (backend).
- If you add new dependencies, update `package.json` and re-run `npm install`.

---

## FAQ / Questions

- **Where do I add a new page?**  
  Add a new component in `src/components/`, then add a route in `App.jsx`.
- **How do I access user info or authentication state?**  
  Use `AuthContext` via `useContext(AuthContext)` or the custom hook if provided.
- **How do I fetch or update data?**  
  Use `DataContext` and its provided methods/state.
- **How do I add a new language or translation?**  
  Update `LanguageContext.jsx` and translation files.
- **How do I change the layout?**  
  Edit `Layout/Layout.jsx`, `Header.jsx`, or `Sidebar.jsx`.

For more, explore the `src/components/` and `src/contexts/` folders. The code is modular and follows React best practices for maintainability.
