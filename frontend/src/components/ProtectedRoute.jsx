import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * Role-based route mapping - Defines which routes each role can access
 * Used for validation and default path determination
 */
const roleRouteMap = {
  admin: [
    "/admin",
    "/admin/teachers",
    "/admin/students",
    "/admin/classes",
    "/admin/batches",
  ],
  teacher: ["/teacher-dashboard", "/teacher/students", "/teacher/exams"],
  student: ["/student-dashboard"],
};

/**
 * ProtectedRoute component - Guards routes based on user authentication and role
 * Automatically redirects unauthorized users or unauthenticated visitors
 * @param {Object} children - Component to render if authorized
 * @param {Array} allowedRoles - Array of roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  // Bug #9 fix: use react-router-dom hooks instead of wouter
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Effect: Check user authentication and authorization
   * Validates user role matches allowedRoles and redirects if necessary
   */
  useEffect(() => {
    // Wait for auth check to complete (user data loading from localStorage)
    if (loading) return;

    // Handle unauthenticated users
    if (!user?.role) {
      if (pathname !== "/login" && pathname !== "/") {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        navigate("/login");
      }
      return;
    }

    // Check if user has required role permission
    const hasPermission = allowedRoles.includes(user.role);
    const userRoutes = roleRouteMap[user.role] || [];
    const isAccessingOwnRole = userRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Redirect to default route if no permission or wrong role route
    if (!hasPermission || !isAccessingOwnRole) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });

      const defaultPath = userRoutes[0];
      if (defaultPath && pathname !== defaultPath) {
        navigate(defaultPath);
      } else {
        navigate("/login");
      }
    }
  }, [pathname, user?.role, loading, navigate, toast, allowedRoles]);

  return children;
};

export default ProtectedRoute;
