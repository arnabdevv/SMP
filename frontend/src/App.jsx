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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />

      <Route path="/admin">
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-dashboard">
        <ProtectedRoute role="teacher">
          <TeacherDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher/students">
        <ProtectedRoute role="teacher">
          <TeacherStudentManagement />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher/exams">
        <ProtectedRoute role="teacher">
          <TeacherExamManagement />
        </ProtectedRoute>
      </Route>

      <Route path="/student">
        <ProtectedRoute role="student">
          <StudentDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/teachers">
        <ProtectedRoute role="admin">
          <ManageTeachers />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/classes">
        <ProtectedRoute role="admin">
          <ManageClasses />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/batches">
        <ProtectedRoute role="admin">
          <ManageBatches />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/students">
        <ProtectedRoute role="admin">
          <ManageStudents />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
