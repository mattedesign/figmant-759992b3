
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleRedirectProps {
  children?: React.ReactNode;
  ownerOnly?: boolean;
}

export const RoleRedirect: React.FC<RoleRedirectProps> = ({ 
  children, 
  ownerOnly = false 
}) => {
  const { isOwner, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If this is an owner-only route and user is not an owner
  if (ownerOnly && !isOwner) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is an owner and trying to access regular dashboard, redirect to owner dashboard
  if (isOwner && location.pathname === '/dashboard') {
    return <Navigate to="/owner/dashboard" replace />;
  }

  // If user is not an owner and trying to access owner dashboard, redirect to regular dashboard
  if (!isOwner && location.pathname.startsWith('/owner')) {
    return <Navigate to="/user/dashboard" replace />;
  }

  // If no children provided, just return null (redirect logic above handles the routing)
  if (!children) {
    return null;
  }

  return <>{children}</>;
};
