import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const getDefaultPath = (role) => {
      switch (role) {
        case "admin":
          return "/admin";
        case "teacher":
          return "/teacher-dashboard";
        case "student":
          return "/student-dashboard";
        default:
          return "/login";
      }
    };

    const checkAccess = () => {
      // Wait for auth to be checked
      if (loading) return;

      // Handle non-authenticated users
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

      // Check role-based access
      const hasPermission = allowedRoles.includes(user.role);
      const userRoutes = roleRouteMap[user.role] || [];
      const isAccessingOwnRole = userRoutes.some((route) =>
        location.startsWith(route)
      );
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
          // Fallback to login if no valid route found
          setLocation("/login");
        }
      }
    };

    checkAccess();
  }, [location, user?.role, loading, setLocation, toast, allowedRoles]);

  return children;
};

export default ProtectedRoute;
