
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeSubscription } from '@/hooks/useStripeSubscription';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { Check, CreditCard, Star, Zap } from 'lucide-react';

export default function Subscription() {
  const { profile, subscription } = useAuth();
  const { subscriptionStatus, createCheckoutSession, openCustomerPortal } = useStripeSubscription();
  const { credits } = useUserCredits();
  const { data: plans } = useSubscriptionPlans();

  const isOwner = profile?.role === 'owner';
  const hasActiveSubscription = subscription?.status === 'active';

  const handleSubscribe = async (planId: string) => {
    try {
      await createCheckoutSession.mutateAsync({ planId });
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const getFeatures = (planType: string, credits: number) => {
    const baseFeatures = [
      `${credits} analysis credits`,
      'AI-powered UX insights',
      'Design upload support',
      'Basic analytics'
    ];

    if (planType === 'recurring') {
      return [
        'Unlimited analysis credits',
        'AI-powered UX insights',
        'Design upload support',
        'Advanced analytics',
        'Priority support',
        'Batch analysis',
        'Comparative insights'
      ];
    }

    return baseFeatures;
  };

  if (isOwner) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Owner Access</h1>
            <p className="text-muted-foreground">
              You have unlimited access to all features as an owner.
            </p>
          </div>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Owner Plan</CardTitle>
              <CardDescription>Unlimited access to all features</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="mb-4">Active</Badge>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited analysis credits
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  All premium features
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Admin access
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Select the perfect plan for your UX analysis needs
          </p>
        </div>

        {/* Current Status */}
        {(hasActiveSubscription || (credits && credits.current_balance > 0)) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {hasActiveSubscription ? 'Unlimited' : credits?.current_balance || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hasActiveSubscription ? 'Analysis Credits' : 'Credits Remaining'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-muted-foreground">Subscription</div>
                </div>
                <div className="text-center">
                  {hasActiveSubscription && (
                    <Button onClick={openCustomerPortal}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.plan_type === 'recurring' ? 'border-primary' : ''}`}>
              {plan.plan_type === 'recurring' && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold">
                  {plan.plan_type === 'recurring' 
                    ? `$${plan.price_monthly}/mo`
                    : `$${plan.credit_price}`
                  }
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {getFeatures(plan.plan_type, plan.credits).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={createCheckoutSession.isPending || hasActiveSubscription}
                  variant={plan.plan_type === 'recurring' ? 'default' : 'outline'}
                >
                  {createCheckoutSession.isPending ? 'Processing...' : 
                   hasActiveSubscription ? 'Current Plan' : 
                   plan.plan_type === 'recurring' ? 'Subscribe' : 'Purchase Credits'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>All plans include secure payment processing and can be cancelled anytime.</p>
        </div>
      </div>
    </div>
  );
}
