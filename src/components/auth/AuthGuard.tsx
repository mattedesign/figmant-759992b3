
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
  requireAuth = false,
  requireOwner = false,
  requireActiveSubscription = false
}: AuthGuardProps) => {
  const { user, profile, subscription, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate('/auth');
        return;
      }
      
      if (requireOwner && profile?.role !== 'owner') {
        navigate('/dashboard');
        return;
      }
    }
  }, [user, profile, loading, navigate, requireAuth, requireOwner]);

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
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/dashboard')} 
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
              onClick={() => navigate('/dashboard')} 
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
