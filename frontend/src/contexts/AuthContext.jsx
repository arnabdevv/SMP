import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Only admin login is supported for now
      const response = await axios.post("/admin/login", { email, password });
      // Optionally, fetch user profile here if needed
      // For now, just set a minimal user object
      console.log(response);

      const userObj = {
        email,
        role: "admin",
        name: "Admin",
      };
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
    } catch (err) {
      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/admin/logout");
    } catch (err) {
      // Optionally handle error
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
