
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Zap, Coins, Check } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useCreditPurchase } from '@/hooks/useCreditPurchase';
import { useToast } from '@/hooks/use-toast';

export const CreditsPage: React.FC = () => {
  const { credits } = useUserCredits();
  const { plans } = useSubscriptionPlans();
  const { handlePurchaseCredits, isProcessing } = useCreditPurchase();
  const { toast } = useToast();

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;
  const totalUsed = credits?.total_used || 0;

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
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">Credits</h1>
        <p className="text-muted-foreground">
          Manage your analysis credits and purchase more
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Current Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">{currentBalance} / {totalPurchased}</div>
              <Progress value={totalPurchased > 0 ? (currentBalance / totalPurchased) * 100 : 0} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Credits remaining
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Purchased</span>
                <span className="text-sm font-medium">{totalPurchased} credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Used</span>
                <span className="text-sm font-medium">{totalUsed} credits</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Available</span>
                <span className="font-medium">{currentBalance} credits</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          {creditPlans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {creditPlans.map((plan) => {
                const price = plan.credit_price || plan.price_monthly || 0;
                const isValidPlan = price > 0 && plan.credits > 0;
                
                return (
                  <div key={plan.id} className="p-4 border rounded-lg text-center relative">
                    {plan.credits >= 100 && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        Best Value
                      </Badge>
                    )}
                    <div className="flex items-center justify-center mb-2">
                      <Coins className="h-5 w-5 mr-2" />
                      <div className="text-xl font-bold">{plan.credits}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">Credits</div>
                    <div className="text-lg font-semibold mb-2">
                      {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
                    </div>
                    {price > 0 && (
                      <div className="text-xs text-muted-foreground mb-4">
                        ${(price / plan.credits).toFixed(3)} per credit
                      </div>
                    )}
                    
                    <ul className="space-y-1 mb-4 text-xs text-left">
                      {getFeatures(plan.credits).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
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
                          : 'Purchase'
                      }
                    </Button>
                    {!isValidPlan && (
                      <p className="text-xs text-muted-foreground mt-2">
                        This plan is not properly configured.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Credit Packs Available</h3>
              <p className="text-muted-foreground">
                Credit packs are currently being configured. Please check back soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
