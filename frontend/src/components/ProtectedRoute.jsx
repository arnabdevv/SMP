const ProtectedRoute = ({ children }) => {
  // In static mode, we don't protect routes. 
  // The AuthContext provides a default user, so components that rely on it will still work.
  return children;
};

export default ProtectedRoute;