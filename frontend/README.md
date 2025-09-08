# SMP Frontend

## Overview

This is the frontend for the School Management Platform (SMP). It is a React + Vite + Tailwind CSS application for managing school operations, including students, teachers, classes, exams, fees, and more. The codebase is modular, scalable, and uses React Context for state management.

## Tech Stack

- **Framework:** React (JSX)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Icons:** lucide-react
- **Linting:** ESLint

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

## Context Usage

### AuthContext

```jsx
// AuthContext.jsx
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  userRole: null,
});
```

Usage:

```jsx
const { user, login, logout } = useAuth();
```

### DataContext

```jsx
// DataContext.jsx
export const DataContext = createContext({
  students: [],
  teachers: [],
  classes: [],
  batches: [],
  fetchData: () => {},
  refreshData: () => {},
});
```

Usage:

```jsx
const { students, fetchData } = useData();
```

### LanguageContext

```jsx
// LanguageContext.jsx
export const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});
```

Usage:

```jsx
const { t, setLanguage } = useLanguage();
```

## API Integration

### Axios Setup

```javascript
// api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
```

### API Modules

- `admin.js`: Admin-specific API calls
- `student.js`: Student management APIs
- `classBatch.js`: Class and batch operations
- `axios.js`: Configured axios instance

## Features

### Authentication & Authorization

- Role-based access control
- JWT token management
- Protected routes
- Login/logout functionality

### Admin Features

- Dashboard with statistics
- Teacher management
- Student management
- Class/batch management
- Fee management

### Teacher Features

- Dashboard
- Attendance management
- Student list view
- Exam management

### Student Features

- Personal dashboard
- View attendance
- View exam results

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Contributing

1. Branch naming: `feature/feature-name` or `fix/bug-name`
2. Commit messages: Follow conventional commits
3. Create PRs with clear descriptions
4. Ensure ESLint passes: `npm run lint`

## Common Components Usage

### DataTable

```jsx
<DataTable
  data={students}
  columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ]}
  onSort={(key) => handleSort(key)}
  onFilter={(filters) => handleFilter(filters)}
/>
```

### Modal

```jsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Student">
  <StudentForm onSubmit={handleSubmit} />
</Modal>
```

### StatsCard

```jsx
<StatsCard
  title="Total Students"
  value={studentCount}
  icon={<UserIcon />}
  trend={10}
/>
```

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
