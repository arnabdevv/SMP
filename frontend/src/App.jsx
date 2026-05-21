import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherStudentManagement from "./pages/TeacherStudentManagement";
import TeacherExamManagement from "./pages/TeacherExamManagement";
import StudentDashboard from "./pages/StudentDashboard";
import ManageTeachers from "./pages/ManageTeachers";
import ManageClasses from "./pages/ManageClasses";
import ManageBatches from "./pages/ManageBatches";
import ManageStudents from "./pages/ManageStudents";
import NotFound from "@/pages/not-found";

/**
 * Router component - Defines all application routes with role-based protection
 * Routes are protected using ProtectedRoute component that validates user roles
 */
function Router() {
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Admin routes - only accessible by admin users */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher routes - only accessible by teacher users */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherStudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/exams"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherExamManagement />
          </ProtectedRoute>
        }
      />

      {/* Student routes - only accessible by student users */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin management routes */}
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/batches"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageBatches />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageStudents />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for undefined paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * App component - Main application wrapper with providers
 * Sets up authentication, UI providers, and routing
 */
function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
