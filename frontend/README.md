# School Management Platform - Frontend

## Overview

The frontend of the School Management Platform is a modern, responsive React application built with Vite. It provides role-based user interfaces for Admins, Teachers, and Students with dedicated dashboards and management tools.

## 🏗️ Technology Stack

### Core Framework
- **React**: 19.1.1 - Latest React with modern hooks and features
- **Vite**: 7.1.2 - Lightning-fast build tool and dev server
- **JavaScript**: ES6+ with JSX

### Routing & Navigation
- **React Router DOM**: 7.8.2 - Client-side routing
- **Wouter**: 3.7.1 - Lightweight routing alternative
- **Protected Routes**: Custom role-based route protection

### Styling & UI
- **Tailwind CSS**: 3.4.17 - Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled component primitives
  - Dialog, Select, Checkbox, Label, Popover, Toast, Tooltip
- **tailwindcss-animate**: Animation utilities
- **PostCSS**: 8.5.6 - CSS processing
- **Autoprefixer**: 10.4.21 - CSS vendor prefixing

### State Management
- **React Context API**: Global authentication state
- **TanStack React Query**: 5.87.1 - Server state management and caching
- **Custom Hooks**: Reusable state logic

### Form Handling & Validation
- **React Hook Form**: 7.62.0 - Performant form management
- **Zod**: 4.1.5 - TypeScript-first schema validation
- **@hookform/resolvers**: 5.2.1 - Validation resolver for React Hook Form

### HTTP & Data Fetching
- **Axios**: 1.12.2 - Promise-based HTTP client
- **React Query**: Intelligent caching and background refetching

### UI Utilities
- **Lucide React**: 0.542.0 - Beautiful, consistent icon library
- **React Toastify**: 11.0.5 - Toast notifications
- **date-fns**: 4.1.0 - Modern date utility library
- **React Day Picker**: 9.9.0 - Date picker component
- **clsx**: 2.1.1 - Conditional className utility
- **class-variance-authority**: 0.7.1 - CVA for variant management
- **tailwind-merge**: 3.3.1 - Merge Tailwind classes without conflicts

### Development Tools
- **ESLint**: 9.33.0 - Code linting
- **TypeScript**: 5.9.2 - Type definitions for better IDE support
- **Vite Plugin React**: 5.0.0 - Fast refresh and JSX support

## ✨ Features

### 🔐 Authentication
- Role-based login system (Admin/Teacher/Student)
- JWT token authentication with automatic refresh
- Protected routes with role verification
- Persistent authentication state
- Automatic redirection based on user role

### 👨‍💼 Admin Features
- **Dashboard**: System overview with statistics
- **Teacher Management**: 
  - View all teachers
  - Register new teachers
  - Edit teacher information
  - Delete teachers
- **Student Management**: 
  - View all students
  - Register individual students
  - Bulk student registration
  - Edit student information
  - Assign students to classes/batches
- **Class Management**: 
  - Create and manage classes
  - View class details
  - Edit/delete classes
- **Batch Management**: 
  - Create batches within classes
  - Manage batch assignments
  - Edit/delete batches

### 👨‍🏫 Teacher Features
- **Dashboard**: Teacher-specific overview
- **Student Management**: 
  - View students in assigned classes
  - Filter students by class and batch
  - Access student information
- **Exam Management**: 
  - Create and manage exams
  - Grade assignments
  - Track student performance

### 👨‍🎓 Student Features
- **Dashboard**: Personalized student dashboard
- **Profile**: View and update profile information
- **Academic Info**: View class and batch details
- **Assignments**: Access course materials and assignments

### 🎨 UI/UX Features
- Modern, responsive design
- Loading states and skeletons
- Toast notifications for user feedback
- Form validation with helpful error messages
- Accessible components (WCAG compliant)
- Dark mode support (via shadcn/ui)
- Smooth animations and transitions

## 📁 Project Structure

```
frontend/
├── public/                       # Static assets
├── src/
│   ├── main.jsx                  # Application entry point
│   ├── App.jsx                   # Root component with routing setup
│   ├── App.css                   # Global application styles
│   ├── index.css                 # Tailwind directives and global styles
│   │
│   ├── components/               # Reusable components
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── select.jsx
│   │   │   ├── checkbox.jsx
│   │   │   ├── toast.jsx
│   │   │   ├── toaster.jsx
│   │   │   └── ... (more UI components)
│   │   ├── Navbar.jsx            # Navigation component
│   │   ├── ProtectedRoute.jsx    # Route protection HOC
│   │   ├── TeacherSidebar.jsx    # Teacher navigation sidebar
│   │   └── LoadingDashboard.jsx  # Loading state component
│   │
│   ├── pages/                    # Page components
│   │   ├── Login.jsx             # Universal login page
│   │   ├── AdminDashboard.jsx    # Admin main dashboard
│   │   ├── ManageTeachers.jsx    # Teacher management page
│   │   ├── ManageStudents.jsx    # Student management page
│   │   ├── ManageClasses.jsx     # Class management page
│   │   ├── ManageBatches.jsx     # Batch management page
│   │   ├── TeacherDashboard.jsx  # Teacher main dashboard
│   │   ├── TeacherStudentManagement.jsx
│   │   ├── TeacherExamManagement.jsx
│   │   ├── StudentDashboard.jsx  # Student main dashboard
│   │   └── not-found.tsx         # 404 page
│   │
│   ├── contexts/                 # React Context providers
│   │   └── AuthContext.jsx       # Authentication state management
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-mobile.jsx        # Mobile detection hook
│   │   ├── use-toast.jsx         # Toast notification hook
│   │   └── ...
│   │
│   ├── services/                 # API service layer
│   │   └── api.js                # Axios instance and API calls
│   │
│   └── lib/                      # Utility functions
│       └── utils.js              # Helper functions (cn, etc.)
│
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
├── jsconfig.json                 # JavaScript configuration (path aliases)
├── components.json               # shadcn/ui configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

Features in development mode:
- Hot Module Replacement (HMR)
- Fast refresh for instant updates
- Source maps for debugging
- Dev server with automatic browser reload

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

The build output will be in the `dist/` directory.

### Linting

Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 🔐 Authentication Flow

1. **Login**: User enters credentials (email/password) and selects role
2. **Token Storage**: JWT token received from backend stored in cookies
3. **Context Update**: AuthContext updates with user data and role
4. **Route Protection**: ProtectedRoute component validates user role
5. **Redirection**: User redirected to appropriate dashboard based on role
6. **Persistence**: Authentication state persists across page refreshes
7. **Logout**: Token cleared and user redirected to login

## 🛣️ Routing Structure

### Public Routes
- `/` - Login page
- `/login` - Login page (alias)

### Protected Routes (Admin Only)
- `/admin` - Admin dashboard
- `/admin/teachers` - Manage teachers
- `/admin/students` - Manage students
- `/admin/classes` - Manage classes
- `/admin/batches` - Manage batches

### Protected Routes (Teacher Only)
- `/teacher-dashboard` - Teacher dashboard
- `/teacher/students` - Student management
- `/teacher/exams` - Exam management

### Protected Routes (Student Only)
- `/student-dashboard` - Student dashboard

### Fallback
- `*` - 404 Not Found page

## 🎨 Styling Approach

### Tailwind CSS
- Utility-first CSS framework
- Custom configuration in `tailwind.config.js`
- Custom color scheme and design tokens
- Responsive design utilities
- Animation utilities via `tailwindcss-animate`

### Component Variants
- Using `class-variance-authority` (CVA) for variant management
- Consistent component API across the application
- Type-safe variant props

### Class Management
- `cn()` utility function for merging Tailwind classes
- Prevents class conflicts with `tailwind-merge`
- Conditional styling with `clsx`

### shadcn/ui Integration
- Pre-built, customizable components
- Built on Radix UI primitives for accessibility
- Fully customizable through Tailwind
- Copy-paste component architecture

## 🔌 API Integration

### Axios Configuration
- Base URL configured for backend (`http://localhost:3000`)
- Automatic credential inclusion for authentication
- Interceptors for error handling
- Request/response transformation

### React Query
- Server state management
- Intelligent caching strategies
- Background refetching
- Optimistic updates
- Query invalidation for data consistency

### API Service Layer
Located in `src/services/api.js`:
- Centralized API endpoint definitions
- Reusable API functions
- Type-safe request/response handling
- Error handling and transformation

## 🧩 Key Components

### ProtectedRoute
Higher-order component that protects routes based on user roles:
```jsx
<ProtectedRoute allowedRoles={['admin', 'teacher']}>
  <YourComponent />
</ProtectedRoute>
```

### AuthContext
Provides authentication state and methods throughout the app:
- `user`: Current user data
- `isAuthenticated`: Authentication status
- `login()`: Login function
- `logout()`: Logout function
- `loading`: Loading state

### UI Components (shadcn/ui)
Pre-built, accessible components:
- Button, Input, Card, Dialog
- Select, Checkbox, Label
- Toast, Tooltip, Popover
- And more...

## 🛠️ Configuration

### Path Aliases
Configured in `jsconfig.json` and `vite.config.js`:
```javascript
import Component from '@/components/Component';
```

### Tailwind Configuration
Custom theme, colors, and animations in `tailwind.config.js`

### Vite Configuration
- React plugin with Fast Refresh
- Path aliases for cleaner imports
- Build optimizations

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

**CORS Errors**
- Ensure backend is running on `http://localhost:3000`
- Verify backend CORS configuration allows `http://localhost:5173`
- Check credentials are being sent with requests

**Authentication Issues**
- Check cookies are enabled in browser
- Verify JWT token is being sent in requests
- Ensure backend token validation is working

**Styling Issues**
- Run `npm run dev` to ensure Tailwind is rebuilding
- Check Tailwind configuration in `tailwind.config.js`
- Verify PostCSS is processing CSS correctly

**Component Not Found**
- Check import paths are correct
- Verify component file exists
- Check path aliases in `jsconfig.json`

## 📚 Development Guidelines

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Wrap with `ProtectedRoute` if authentication required
4. Specify allowed roles for protected routes

### Adding shadcn/ui Components
```bash
npx shadcn-ui@latest add <component-name>
```
Components are added to `src/components/ui/`

### State Management
- Use React Query for server state
- Use Context API for global client state
- Use local state (`useState`) for component-specific state

### Form Handling
- Use React Hook Form for form state
- Use Zod for validation schemas
- Use shadcn/ui form components for UI

## 🔗 Related Documentation

- [Root README](../README.md) - Overall project documentation
- [Backend README](../backend/README.md) - Backend API documentation
- [Backend ROUTES.md](../backend/ROUTES.md) - API endpoint reference

## 📚 External Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

For questions or issues, please contact the project maintainer.
