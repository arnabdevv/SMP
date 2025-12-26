import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "wouter";
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
    <Switch>
      {/* Public routes - accessible without authentication */}
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />

      {/* Admin routes - only accessible by admin users */}
      <Route path="/admin">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      {/* Teacher routes - only accessible by teacher users */}
      <Route path="/teacher-dashboard">
        <ProtectedRoute allowedRoles={["teacher"]}>
          <TeacherDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher/students">
        <ProtectedRoute allowedRoles={["teacher"]}>
          <TeacherStudentManagement />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher/exams">
        <ProtectedRoute allowedRoles={["teacher"]}>
          <TeacherExamManagement />
        </ProtectedRoute>
      </Route>

      {/* Student routes - only accessible by student users */}
      <Route path="/student-dashboard">
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentDashboard />
        </ProtectedRoute>
      </Route>

      {/* Admin management routes */}
      <Route path="/admin/teachers">
        <ProtectedRoute allowedRoles={["admin"]}>
          <ManageTeachers />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/classes">
        <ProtectedRoute allowedRoles={["admin"]}>
          <ManageClasses />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/batches">
        <ProtectedRoute allowedRoles={["admin"]}>
          <ManageBatches />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/students">
        <ProtectedRoute allowedRoles={["admin"]}>
          <ManageStudents />
        </ProtectedRoute>
      </Route>

      {/* Catch-all route for undefined paths */}
      <Route component={NotFound} />
    </Switch>
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
