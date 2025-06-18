
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useCreditPurchase } from '@/hooks/useCreditPurchase';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard, Zap, Coins } from 'lucide-react';

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditPurchaseModal: React.FC<CreditPurchaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const { credits } = useUserCredits();
  const { plans } = useSubscriptionPlans();
  const { handlePurchaseCredits, isProcessing } = useCreditPurchase();
  const { toast } = useToast();

  const currentBalance = credits?.current_balance || 0;

  // Only show credit-based plans
  const creditPlans = plans?.filter(plan => plan.plan_type === 'credits' && plan.is_active) || [];

  const onPurchaseCredits = async (plan: any) => {
    try {
      console.log('Purchase button clicked for plan:', plan);
      
      // Calculate price based on credit_price or fallback
      const price = plan.credit_price || plan.price_monthly || 0;
      
      if (price <= 0) {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "This credit pack is not properly configured. Please contact support.",
        });
        return;
      }

      await handlePurchaseCredits(
        plan.id,
        plan.name,
        plan.credits,
        price
      );
    } catch (error) {
      console.error('Error in onPurchaseCredits:', error);
      toast({
        variant: "destructive",
        title: "Purchase Error",
        description: "Failed to start purchase process. Please try again.",
      });
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Purchase Analysis Credits</DialogTitle>
          <p className="text-center text-muted-foreground">
            Choose a credit pack that fits your UX analysis needs
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          {currentBalance > 0 && (
            <Card>
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
            {creditPlans.map((plan) => {
              const price = plan.credit_price || plan.price_monthly || 0;
              const isValidPlan = price > 0 && plan.credits > 0;
              
              return (
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
                      {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.credits} credits
                      {price > 0 && ` • $${(price / plan.credits).toFixed(3)} per credit`}
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
                      disabled={isProcessing || !isValidPlan}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {!isValidPlan 
                        ? 'Not Available' 
                        : isProcessing 
                          ? 'Processing...' 
                          : 'Purchase Credits'
                      }
                    </Button>
                    {!isValidPlan && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        This plan is not properly configured.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
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
          <div className="text-center text-sm text-muted-foreground">
            <p>All purchases include secure payment processing. Credits never expire.</p>
            <p className="mt-2 text-xs">Secure payments powered by Stripe.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
