import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;