
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiresSubscription = false 
}) => {
  const { user, loading, hasActiveSubscription, isOwner, subscription } = useAuth();

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

  if (requiresSubscription && !hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              {isOwner 
                ? "Owner access detected - this should not happen. Please contact support."
                : subscription?.status === 'free' 
                  ? "You have free access but this feature requires a paid subscription."
                  : "You need an active subscription to access this feature."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isOwner && (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  {subscription?.status === 'free' 
                    ? "Upgrade to a paid plan to unlock premium features."
                    : "Upgrade to a paid plan to unlock advanced UX analytics features."
                  }
                </p>
                <Button className="w-full" onClick={() => window.location.href = '/subscription'}>
                  View Subscription Plans
                </Button>
              </>
            )}
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
