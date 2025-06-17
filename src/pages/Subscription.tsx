
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useCreditPurchase } from '@/hooks/useCreditPurchase';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard, Star, Zap, Coins, CheckCircle, XCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Subscription() {
  const { profile } = useAuth();
  const { credits, refetchCredits } = useUserCredits();
  const { plans } = useSubscriptionPlans();
  const { handlePurchaseCredits, isProcessing } = useCreditPurchase();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const isOwner = profile?.role === 'owner';
  const currentBalance = credits?.current_balance || 0;

  // Handle success/cancel redirects from Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your credits have been added to your account.",
        duration: 5000,
      });
      // Refresh credits after successful payment
      refetchCredits();
    } else if (canceled === 'true') {
      toast({
        variant: "destructive",
        title: "Payment Canceled",
        description: "Your payment was canceled. No charges were made.",
        duration: 5000,
      });
    }
  }, [searchParams, toast, refetchCredits]);

  // Only show credit-based plans
  const creditPlans = plans?.filter(plan => plan.plan_type === 'credits' && plan.is_active) || [];

  const onPurchaseCredits = async (plan: any) => {
    await handlePurchaseCredits(
      plan.id,
      plan.name,
      plan.credits,
      plan.credit_price || 0
    );
  };

  const getFeatures = (credits: number) => {
    const features = [
      `${credits} analysis credits`,
      'AI-powered UX insights',
      'Design upload support',
      'Detailed analytics reports'
    ];

    if (credits >= 50) {
      features.push('Priority support');
    }

    if (credits >= 100) {
      features.push('Batch analysis support');
      features.push('Advanced insights');
    }

    return features;
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
          <h1 className="text-3xl font-bold mb-4">Purchase Analysis Credits</h1>
          <p className="text-muted-foreground">
            Choose a credit pack that fits your UX analysis needs
          </p>
        </div>

        {/* Success/Error Messages */}
        {searchParams.get('success') === 'true' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment successful! Your credits have been added to your account.
            </AlertDescription>
          </Alert>
        )}

        {searchParams.get('canceled') === 'true' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Payment was canceled. No charges were made to your account.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Status */}
        {currentBalance > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Current Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentBalance}</div>
                  <div className="text-sm text-muted-foreground">Credits Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{credits?.total_purchased || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Purchased</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{credits?.total_used || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Used</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credit Packs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditPlans.map((plan) => (
            <Card key={plan.id} className="relative">
              {plan.credits >= 100 && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Best Value
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold">
                  {plan.credit_price ? `$${plan.credit_price}` : 'Free'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.credits} credits • ${((plan.credit_price || 0) / plan.credits).toFixed(3)} per credit
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {getFeatures(plan.credits).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => onPurchaseCredits(plan)}
                  variant={plan.credits >= 100 ? 'default' : 'outline'}
                  disabled={isProcessing}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Purchase Credits'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {creditPlans.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Credit Packs Available</h3>
              <p className="text-muted-foreground">
                Credit packs are currently being configured. Please check back soon.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>All purchases include secure payment processing. Credits never expire.</p>
          <p className="mt-2 text-xs">Secure payments powered by Stripe.</p>
        </div>
      </div>
    </div>
  );
}
