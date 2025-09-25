import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `http://localhost:3000/${role}/login`;
      const res = await axios.post(
        endpoint,
        { email, password },
        { withCredentials: true } // allow cookies if backend sets JWT
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Only store the role from login response
      setUser({
        role: role
      });

      return res.data;
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error || err.response.data.message
        : "Network error. Check if backend is running.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // console.log(user);

  const logout = async () => {
    setLoading(true);
    try {
      // Even if we don't have a role, try to logout with default role
      const role = user?.role || 'admin';
      
      await axios.get(`http://localhost:3000/${role}/logout`, {
        withCredentials: true,
      });

      setUser(null); // clear user state
      navigate("/"); // redirect to login page
    } catch (err) {
      console.error('Logout error:', err);
      // Even if the server call fails, we still want to clear local state
      setUser(null);
      navigate("/");
    } finally {
      setLoading(false);
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
