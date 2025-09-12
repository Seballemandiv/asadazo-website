import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/');
      } else if (requireAdmin && !isAdmin) {
        navigate('/');
      }
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, navigate]);

  if (loading || !isAuthenticated || (requireAdmin && !isAdmin)) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
