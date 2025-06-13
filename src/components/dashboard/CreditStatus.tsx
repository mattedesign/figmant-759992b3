
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, CreditCard, AlertTriangle, Settings, RefreshCw, Gift } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useStripeSubscription } from '@/hooks/useStripeSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOnboarding } from '@/hooks/useUserOnboarding';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { WelcomePrompt } from '@/components/onboarding/WelcomePrompt';
import { CreditDepletionPrompt } from '@/components/onboarding/CreditDepletionPrompt';

export const CreditStatus = () => {
  const { credits, creditsLoading } = useUserCredits();
  const { subscriptionStatus, refreshSubscription, openCustomerPortal } = useStripeSubscription();
  const { profile, subscription } = useAuth();
  const { onboardingState, loading: onboardingLoading, markWelcomePromptSeen, markCreditDepletionPromptSeen } = useUserOnboarding();
  const navigate = useNavigate();
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);
  const [showCreditDepletionPrompt, setShowCreditDepletionPrompt] = useState(false);

  const isOwner = profile?.role === 'owner';
  const hasActiveSubscription = subscription?.status === 'active' || subscriptionStatus.subscribed;
  const currentBalance = credits?.current_balance || 0;
  const hasAccess = isOwner || hasActiveSubscription || currentBalance > 0;

  // Check if we should show welcome prompt
  useEffect(() => {
    if (!onboardingLoading && onboardingState && !onboardingState.has_seen_welcome_prompt && !isOwner) {
      // Only show if user has the welcome bonus (5 credits purchased, 0 used)
      if (credits?.total_purchased === 5 && credits?.total_used === 0) {
        setShowWelcomePrompt(true);
      }
    }
  }, [onboardingState, onboardingLoading, credits, isOwner]);

  // Check if we should show credit depletion prompt
  useEffect(() => {
    if (!onboardingLoading && onboardingState && !onboardingState.has_seen_credit_depletion_prompt && !isOwner && !hasActiveSubscription) {
      // Show when user has 1 credit left or 0 credits
      if (currentBalance <= 1 && credits?.total_used > 0) {
        setShowCreditDepletionPrompt(true);
      }
    }
  }, [onboardingState, onboardingLoading, currentBalance, credits, isOwner, hasActiveSubscription]);

  const handleWelcomePromptClose = () => {
    setShowWelcomePrompt(false);
    markWelcomePromptSeen();
  };

  const handleCreditDepletionPromptClose = () => {
    setShowCreditDepletionPrompt(false);
    markCreditDepletionPromptSeen();
  };

  if (creditsLoading || subscriptionStatus.loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <CardTitle>Access Status</CardTitle>
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

  const getStatusBadge = () => {
    if (isOwner) {
      return <Badge variant="default">Owner - Unlimited</Badge>;
    }
    if (subscriptionStatus.subscribed) {
      return <Badge variant="default">Active Subscription - {subscriptionStatus.subscription_tier}</Badge>;
    }
    if (hasActiveSubscription) {
      return <Badge variant="default">Active Subscription</Badge>;
    }
    if (currentBalance > 0) {
      const isWelcomeBonus = credits?.total_purchased === 5 && credits?.total_used === 0;
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{currentBalance} Credits Available</Badge>
          {isWelcomeBonus && <Badge variant="outline" className="flex items-center gap-1">
            <Gift className="h-3 w-3" />
            Welcome Bonus
          </Badge>}
        </div>
      );
    }
    return <Badge variant="destructive">No Access</Badge>;
  };

  const getStatusMessage = () => {
    if (isOwner) {
      return "You have unlimited access to all features as an owner.";
    }
    if (subscriptionStatus.subscribed) {
      return `You have unlimited access through your ${subscriptionStatus.subscription_tier} subscription.`;
    }
    if (hasActiveSubscription) {
      return "You have unlimited access through your subscription.";
    }
    if (currentBalance > 0) {
      const isWelcomeBonus = credits?.total_purchased === 5 && credits?.total_used === 0;
      if (isWelcomeBonus) {
        return `Welcome to UX Analytics! You have ${currentBalance} free credits to get started with design analysis.`;
      }
      return `You have ${currentBalance} credits available for analysis.`;
    }
    return "You need an active subscription or credits to perform design analysis.";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5" />
              <CardTitle>Access Status</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshSubscription}
                disabled={subscriptionStatus.loading}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${subscriptionStatus.loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <CardDescription>
            {getStatusMessage()}
          </CardDescription>
          
          {subscriptionStatus.subscribed && subscriptionStatus.subscription_end && (
            <CardDescription className="text-xs">
              Subscription expires: {new Date(subscriptionStatus.subscription_end).toLocaleDateString()}
            </CardDescription>
          )}
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

          {!isOwner && (
            <div className="space-y-3">
              {currentBalance > 0 && !subscriptionStatus.subscribed && (
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
                
                {subscriptionStatus.subscribed && (
                  <Button 
                    variant="outline"
                    onClick={openCustomerPortal}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Manage Subscription</span>
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

      <WelcomePrompt
        isOpen={showWelcomePrompt}
        onClose={handleWelcomePromptClose}
        userCredits={currentBalance}
      />

      <CreditDepletionPrompt
        isOpen={showCreditDepletionPrompt}
        onClose={handleCreditDepletionPromptClose}
        remainingCredits={currentBalance}
      />
    </>
  );
};
