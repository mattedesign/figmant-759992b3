
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeSubscription } from '@/hooks/useStripeSubscription';
import { Check, Star, Zap, Gift, RefreshCw, Settings } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Subscription = () => {
  const { subscription, isOwner } = useAuth();
  const { subscriptionStatus, createCheckoutSession, openCustomerPortal, refreshSubscription } = useStripeSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Handle successful checkout return
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Subscription Successful!",
        description: "Your subscription has been activated. Thank you for subscribing!",
      });
      // Refresh subscription status after successful checkout
      setTimeout(refreshSubscription, 2000);
    }
    if (searchParams.get('canceled') === 'true') {
      toast({
        variant: "destructive",
        title: "Subscription Canceled",
        description: "Your subscription process was canceled. You can try again anytime.",
      });
    }
  }, [searchParams, toast, refreshSubscription]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with UX analytics',
      icon: Gift,
      features: [
        'Basic analytics dashboard',
        'Up to 3 design uploads',
        'Basic user journey mapping',
        'Community support'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      popular: false,
      current: subscription?.status === 'free' && !subscriptionStatus.subscribed
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: 'month',
      description: 'Enhanced analytics for growing teams',
      icon: Star,
      features: [
        'Everything in Free',
        'Unlimited design uploads',
        'Advanced user journey mapping',
        'Real-time monitoring',
        'Email support',
        'Basic AI insights'
      ],
      buttonText: 'Upgrade to Basic',
      buttonVariant: 'default' as const,
      popular: true,
      current: subscriptionStatus.subscribed && subscriptionStatus.subscription_tier === 'Basic'
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: '$99',
      period: 'month',
      description: 'Full power for enterprise teams',
      icon: Zap,
      features: [
        'Everything in Basic',
        'Advanced AI-powered insights',
        'Custom integrations',
        'Priority support',
        'Advanced reporting',
        'Team collaboration tools',
        'White-label options'
      ],
      buttonText: 'Upgrade to Unlimited',
      buttonVariant: 'default' as const,
      popular: false,
      current: subscriptionStatus.subscribed && subscriptionStatus.subscription_tier === 'Unlimited'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      navigate('/dashboard');
      return;
    }

    if (planId === 'basic') {
      createCheckoutSession('basic');
    } else if (planId === 'unlimited') {
      createCheckoutSession('unlimited');
    }
  };

  if (isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
            <p className="text-xl text-muted-foreground">
              Owner accounts have full access to all features
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4 w-fit">Owner Access</Badge>
                <CardTitle>Full Platform Access</CardTitle>
                <CardDescription>
                  As the platform owner, you have unlimited access to all features and functionality.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => navigate('/owner')}>
                  Go to Owner Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with our free tier and upgrade when you need more advanced features
          </p>
          
          {/* Subscription Status Display */}
          <div className="mt-6 flex justify-center items-center gap-4">
            {subscriptionStatus.loading ? (
              <Badge variant="secondary" className="text-sm">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Checking subscription...
              </Badge>
            ) : subscriptionStatus.subscribed ? (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-sm">
                  <Check className="h-3 w-3 mr-1" />
                  Active: {subscriptionStatus.subscription_tier} Plan
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCustomerPortal}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  Manage
                </Button>
              </div>
            ) : (
              <Badge variant="secondary" className="text-sm">
                <Gift className="h-3 w-3 mr-1" />
                Currently on Free Plan
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshSubscription}
              disabled={subscriptionStatus.loading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${subscriptionStatus.loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {subscriptionStatus.subscribed && subscriptionStatus.subscription_end && (
            <p className="text-sm text-muted-foreground mt-2">
              Subscription expires: {new Date(subscriptionStatus.subscription_end).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge variant="secondary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full mt-6" 
                    variant={plan.current ? 'outline' : plan.buttonVariant}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={plan.current || subscriptionStatus.loading}
                  >
                    {plan.current ? 'Current Plan' : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need help choosing?</h2>
          <p className="text-muted-foreground mb-6">
            Start with our free tier and upgrade anytime as your needs grow
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            {subscriptionStatus.subscribed && (
              <Button onClick={openCustomerPortal} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manage Subscription
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;
