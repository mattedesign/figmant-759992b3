
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CreditCard, AlertTriangle } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOwner?: boolean;
  requireActiveSubscription?: boolean;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true,
  requireOwner = false,
  requireActiveSubscription = false
}: AuthGuardProps) => {
  const { user, profile, subscription, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthGuard effect - loading:', loading, 'user:', user?.id, 'profile:', profile?.role, 'requireOwner:', requireOwner);
    
    if (!loading && !user && requireAuth) {
      // Only redirect to auth if not already there
      if (window.location.pathname !== '/auth') {
        console.log('AuthGuard: No user, redirecting to auth');
        navigate('/auth');
      }
      return;
    }

    if (!loading && user && !requireAuth) {
      // Authenticated user accessing auth page -> redirect to main app
      if (window.location.pathname === '/auth') {
        console.log('AuthGuard: Authenticated user on auth page, redirecting to figmant');
        navigate('/figmant');
        return;
      }
    }

    // Handle owner requirements
    if (requireOwner && user) {
      if (profile === null) {
        // Still loading profile
        return;
      }
      
      if (profile?.role !== 'owner') {
        // Not an owner, redirect to main dashboard
        console.log('AuthGuard: User is not owner, redirecting to figmant. Profile:', profile);
        navigate('/figmant');
        return;
      }
    }
  }, [user, profile, loading, navigate, requireAuth, requireOwner]);

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while profile is being fetched for owner-required routes
  if (requireOwner && user && profile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireOwner && profile?.role !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Your role: {profile?.role || 'unknown'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/figmant')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireActiveSubscription && subscription?.status !== 'active' && profile?.role !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need an active subscription to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/subscription')} 
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              View Subscription Plans
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/figmant')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
