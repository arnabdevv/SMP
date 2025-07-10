# SMP Project

## Overview

The SMP project is a web application built using React, Vite, and Tailwind CSS. It is designed to manage various aspects of a school, including exams, students, teachers, and administrative tasks. The project is structured to ensure modularity and scalability.

## File Structure

### Root Directory

- **eslint.config.js**: Configuration for ESLint, ensuring code quality.
- **index.html**: Entry point for the application.
- **package.json**: Contains project dependencies and scripts.
- **postcss.config.js**: Configuration for PostCSS, used with Tailwind CSS.
- **tailwind.config.js**: Configuration for Tailwind CSS.
- **vite.config.js**: Configuration for Vite, the build tool.

### `src` Directory

Contains the main source code for the application.

#### `App.jsx`

The main application component.

#### `index.css`

Global CSS styles.

#### `main.jsx`

Entry point for the React application.

#### `components` Directory

Contains reusable components organized by functionality.

##### `Admin`

- **AdminDashboard.jsx**: Dashboard for administrative tasks.
- **ClassManagement.jsx**: Manage classes.
- **FeeRecords.jsx**: Manage fee records.
- **StudentManagement.jsx**: Manage student information.
- **TeacherManagement.jsx**: Manage teacher information.

##### `Auth`

- **Login.jsx/**: Login page for authentication.

##### `Common`

- **DataTable.jsx**: Reusable table component.
- **Modal.jsx**: Reusable modal component.
- **StatsCard.jsx**: Card component for displaying statistics.

##### `Layout`

- **Header.jsx**: Header component.
- **Layout.jsx/tsx**: Main layout component.
- **Sidebar.jsx**: Sidebar navigation.

##### `Student`

- **StudentDashboard.jsx**: Dashboard for students.

##### `Teacher`

- **Attendance.jsx**: Manage attendance.
- **ExamManagement.jsx**: Manage exams.
- **StudentList.jsx**: List of students.
- **TeacherDashboard.jsx**: Dashboard for teachers.

#### `contexts` Directory

Contains React context files for managing global state.

- **AuthContext.jsx**: Context for authentication.
- **DataContext.jsx**: Context for managing data.
- **LanguageContext.jsx**: Context for managing language settings.

#### `types` Directory

Contains type definitions.

- **index.js**: Type definitions for the project.

## Scripts

The following scripts are available in `package.json`:

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `lint`: Runs ESLint.
- `preview`: Previews the production build.

## Configuration Files

- **Vite**: Configured in `vite.config.js`.
- **Tailwind CSS**: Configured in `tailwind.config.js`.
- **PostCSS**: Configured in `postcss.config.js`.
- **ESLint**: Configured in `eslint.config.js`.

## Dependencies

### Production

- `lucide-react`: Icon library.
- `react`: JavaScript library for building user interfaces.
- `react-dom`: React DOM renderer.
- `react-router-dom`: Library for routing.

### Development

- `@eslint/js`: ESLint configuration.
- `@types/react`: TypeScript definitions for React.
- `@types/react-dom`: TypeScript definitions for React DOM.
- `@vitejs/plugin-react`: React plugin for Vite.
- `autoprefixer`: PostCSS plugin for adding vendor prefixes.
- `eslint`: Linter for JavaScript.
- `eslint-plugin-react-hooks`: ESLint rules for React hooks.
- `eslint-plugin-react-refresh`: ESLint rules for React Refresh.
- `globals`: Global variables for ESLint.
- `postcss`: CSS processing tool.
- `tailwindcss`: Utility-first CSS framework.
- `vite`: Build tool.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview the production build:
   ```bash
   npm run preview
   ```

## Routes and Components

### Admin

- **AdminDashboard**: `/admin/dashboard`
- **ClassManagement**: `/admin/classes`
- **FeeRecords**: `/admin/fees`
- **StudentManagement**: `/admin/students`
- **TeacherManagement**: `/admin/teachers`

### Auth

- **Login**: `/login`

### Student

- **StudentDashboard**: `/student/dashboard`

### Teacher

- **TeacherDashboard**: `/teacher/dashboard`
- **ExamManagement**: `/teacher/exams`
- **Attendance**: `/teacher/attendance`
- **StudentList**: `/teacher/students`

## Contexts

- **AuthContext**: Manages authentication state.
- **DataContext**: Manages application data.
- **LanguageContext**: Manages language settings.

## Notes

This project uses modular components and contexts to ensure scalability and maintainability. Tailwind CSS is used for styling, and Vite is used for fast builds and development.
