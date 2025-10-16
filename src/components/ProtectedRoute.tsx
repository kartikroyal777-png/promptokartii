import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Loader } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loadingProfile } = useProfile();

  if (authLoading || (user && loadingProfile)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin w-8 h-8 text-accent" /></div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
