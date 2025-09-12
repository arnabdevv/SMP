import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Provide a default static user for viewing the dashboard
  const [user] = useState({
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  });

  // Mock login/logout functions that do nothing
  const login = async (email, password, role) => {
    console.log('Login attempt in static mode:', { email, role });
    alert('Login functionality is disabled in static mode.');
    // In a real app, you would redirect here, but we will rely on the app's default navigation
  };

  const logout = () => {
    console.log('Logout in static mode.');
    alert('Logout functionality is disabled in static mode.');
  };

  const value = {
    user,
    login,
    logout,
    loading: false, // Always false as auth is static
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};