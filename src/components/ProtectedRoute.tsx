import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-primary-blue mx-auto mb-4 animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Clear any potentially cached data before redirecting
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    return <Navigate to="/admin/login" replace state={{ from: window.location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;