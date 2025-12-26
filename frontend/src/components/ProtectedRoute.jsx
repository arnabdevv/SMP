import { useEffect } from "react";
import { useLocation } from "wouter";
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
  const [location, setLocation] = useLocation();
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
      if (location !== "/login" && location !== "/") {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        setLocation("/login");
      }
      return;
    }

    // Check if user has required role permission
    const hasPermission = allowedRoles.includes(user.role);
    const userRoutes = roleRouteMap[user.role] || [];
    const isAccessingOwnRole = userRoutes.some((route) =>
      location.startsWith(route)
    );

    // Redirect to default route if no permission or wrong role route
    if (!hasPermission || !isAccessingOwnRole) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });

      const defaultPath = userRoutes[0];
      if (defaultPath && location !== defaultPath) {
        setLocation(defaultPath);
      } else {
        setLocation("/login");
      }
    }
  }, [location, user?.role, loading, setLocation, toast, allowedRoles]);

  return children;
};

export default ProtectedRoute;
