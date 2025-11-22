import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Check if user is admin
  // In a real app, this would check the user's role from the backend
  const isAdmin = user?.role === 'ADMIN' || user?.email === 'admin@sparkmate.com';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/discover" replace />;
  }

  return children;
};

export default AdminRoute;

