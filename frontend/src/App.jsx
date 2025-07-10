import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ClassManagement from "./components/Admin/ClassManagement";
import StudentManagement from "./components/Admin/StudentManagement";
import TeacherManagement from "./components/Admin/TeacherManagement";
import FeeRecords from "./components/Admin/FeeRecords";
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import ExamManagement from "./components/Teacher/ExamManagement";
import StudentList from "./components/Teacher/StudentList";
import Attendance from "./components/Teacher/Attendance";
import StudentDashboard from "./components/Student/StudentDashboard";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate to={`/${user.role}/dashboard`} replace />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <ClassManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <StudentManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <TeacherManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/test-marks"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <div>Test Reports (Coming Soon)</div>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fee-records"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <FeeRecords />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <Layout>
              <TeacherDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <Layout>
              <StudentList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/exams"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <Layout>
              <ExamManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <Layout>
              <Attendance />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/marks"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <div>My Marks (Coming Soon)</div>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/fees"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <div>My Fees (Coming Soon)</div>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <div>My Profile (Coming Soon)</div>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default Routes */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.role}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <AppContent />
          </Router>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
