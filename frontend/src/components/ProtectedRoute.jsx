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
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role) {
      const hasPermission = allowedRoles.includes(user.role);
      const isAccessingOwnRole = roleRouteMap[user.role]?.some((route) =>
        location.startsWith(route)
      );

      if (!hasPermission || !isAccessingOwnRole) {
        // Show toast notification
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });

        // Redirect to user's own dashboard
        const redirectPath =
          user.role === "admin"
            ? "/admin-dashboard"
            : user.role === "teacher"
            ? "/teacher-dashboard"
            : "/student-dashboard";

        if (location !== redirectPath) {
          setLocation(redirectPath);
        }
      }
    } else if (location !== "/login" && location !== "/") {
      // If no user and not on login page, redirect to login
      setLocation("/login");
    }
  }, [location, user?.role, setLocation, toast, allowedRoles]);

  return children;
};

export default ProtectedRoute;
