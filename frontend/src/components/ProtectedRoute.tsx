import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
