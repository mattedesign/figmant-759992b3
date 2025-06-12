
import React from 'react';
import { AdminAssetDashboard } from '@/components/admin/AdminAssetDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminAssets = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // In a real app, you'd check if user has admin/owner role
  // For now, we'll allow all authenticated users

  return <AdminAssetDashboard />;
};

export default AdminAssets;
