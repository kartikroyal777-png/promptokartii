import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
