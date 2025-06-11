
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
  requiredRole?: 'owner' | 'subscriber';
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiresSubscription = false,
  requiredRole
}) => {
  const { user, loading, hasActiveSubscription, isOwner, subscription, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check for required role
  if (requiredRole) {
    if (requiredRole === 'owner' && !isOwner) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this area. Owner access is required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (requiredRole === 'subscriber' && profile?.role !== 'subscriber' && !isOwner) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have the required role to access this area.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // If subscription is required but user doesn't have access
  if (requiresSubscription && !hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              {subscription?.status === 'free' 
                ? "This feature requires a paid subscription. Upgrade to unlock advanced UX analytics features."
                : "You need an active subscription to access this feature."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Upgrade to a paid plan to unlock premium features and advanced analytics.
            </p>
            <Button className="w-full" onClick={() => window.location.href = '/subscription'}>
              View Subscription Plans
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard'}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
