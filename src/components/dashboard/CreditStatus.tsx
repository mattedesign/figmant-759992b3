
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, CreditCard, AlertTriangle } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CreditStatus = () => {
  const { credits, creditsLoading } = useUserCredits();
  const { profile, subscription } = useAuth();
  const navigate = useNavigate();

  if (creditsLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <CardTitle>Credits</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isOwner = profile?.role === 'owner';
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'free';
  const currentBalance = credits?.current_balance || 0;
  const hasAccess = isOwner || hasActiveSubscription || currentBalance > 0;

  const getStatusBadge = () => {
    if (isOwner) {
      return <Badge variant="default">Owner - Unlimited</Badge>;
    }
    if (hasActiveSubscription) {
      return <Badge variant="default">Active Subscription</Badge>;
    }
    if (currentBalance > 0) {
      return <Badge variant="secondary">{currentBalance} Credits Available</Badge>;
    }
    return <Badge variant="destructive">No Access</Badge>;
  };

  const getStatusMessage = () => {
    if (isOwner) {
      return "You have unlimited access to all features as an owner.";
    }
    if (hasActiveSubscription) {
      return "You have unlimited access through your subscription.";
    }
    if (currentBalance > 0) {
      return `You have ${currentBalance} credits available for analysis.`;
    }
    return "You need an active subscription or credits to perform design analysis.";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <CardTitle>Access Status</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          {getStatusMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasAccess && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need an active subscription or credits to upload and analyze designs.
            </AlertDescription>
          </Alert>
        )}

        {!isOwner && !hasActiveSubscription && (
          <div className="space-y-3">
            {currentBalance > 0 && (
              <div className="text-sm text-muted-foreground">
                Each design analysis costs 1 credit.
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => navigate('/subscription')}
                className="flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>View Subscription Plans</span>
              </Button>
              
              {currentBalance === 0 && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/subscription')}
                  className="flex items-center space-x-2"
                >
                  <Coins className="h-4 w-4" />
                  <span>Purchase Credits</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {credits && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{credits.current_balance}</div>
              <div className="text-xs text-muted-foreground">Current Balance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{credits.total_purchased}</div>
              <div className="text-xs text-muted-foreground">Total Purchased</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{credits.total_used}</div>
              <div className="text-xs text-muted-foreground">Total Used</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
