import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    name: 'John Teacher',
    email: 'teacher@school.com',
    role: 'teacher',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '3',
    name: 'Jane Student',
    email: 'student@school.com',
    role: 'student',
    classId: '1',
    className: 'Class 10',
    batchId: '1',
    batchName: 'Batch A',
    profileImage: 'https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};