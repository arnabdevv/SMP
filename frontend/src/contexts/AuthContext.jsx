import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

/**
 * AuthContext - Manages authentication state and user data
 * Provides login, logout, and user information to the entire application
 */
const AuthContext = createContext();

/**
 * useAuth hook - Custom hook to access authentication context
 * Throws error if used outside of AuthProvider
 * @returns {Object} Auth context containing user, login, logout, loading, error
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component - Wraps application with authentication context
 * Handles user login, logout, and session persistence
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Current user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error messages

  /**
   * Effect: Load user from localStorage on app startup
   * Checks if user session exists and validates role is present
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate that parsed user has a role property
        if (parsedUser && parsedUser.role) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        // If JSON parse fails, clear localStorage
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * login function - Authenticates user and stores session
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (admin/teacher/student)
   * @throws {Error} If login fails or network error occurs
   */
  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post(`/${role}/login`, { email, password });

      // Normalize response: admin returns res.data.name directly,
      // teacher/student return res.data.user.fullName
      const userData = {
        ...(res.data.user || {}),
        role: role,
        name: res.data.name || res.data.user?.fullName || "",
      };

      setUser(userData);
      // Persist user data and token to localStorage for session recovery
      localStorage.setItem("user", JSON.stringify(userData));
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      return res.data;
    } catch (err) {
      // Extract error message from various response formats
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Network error. Please check your connection.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * logout function - Clears user session and redirects to login
   * Attempts to notify backend of logout, but clears local data regardless
   */
  const logout = async () => {
    setLoading(true);
    try {
      const role = user?.role || "admin";
      await apiClient.get(`/${role}/logout`);
    } catch (err) {
      // Log error but don't throw - logout should complete regardless
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLoading(false);
      // Redirect to login page
      navigate("/login");
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
