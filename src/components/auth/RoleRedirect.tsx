
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleRedirectProps {
  children: React.ReactNode;
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

  // Allow owners to access both dashboards - remove automatic redirect
  // Owners can now manually choose which dashboard to view via the UserMenu

  // If user is not an owner and trying to access owner dashboard, redirect to subscriber dashboard
  if (!isOwner && location.pathname === '/owner') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
