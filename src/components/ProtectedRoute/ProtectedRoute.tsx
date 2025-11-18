import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Verificando sesión...</p>
      </div>
    );
  }

  if (!user) {
    console.log('⚠️ Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;