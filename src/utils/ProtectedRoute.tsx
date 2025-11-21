import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { AuthState, ProtectedRouteProps } from '@/types/index';


export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector<AuthState>((state) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access if required roles are specified
  if (requiredRoles && requiredRoles.length > 0) {
    if (!user || !requiredRoles.includes(user.profile.role)) {
      // Redirect to dashboard if user doesn't have the required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
