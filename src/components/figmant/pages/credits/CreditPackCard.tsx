
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Coins } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface CreditPackCardProps {
  plan: SubscriptionPlan;
  onPurchase: (plan: SubscriptionPlan) => void;
  isProcessing: boolean;
}

export const CreditPackCard: React.FC<CreditPackCardProps> = ({
  plan,
  onPurchase,
  isProcessing
}) => {
  const price = plan.credit_price || plan.price_monthly || 0;
  const isValidPlan = price > 0 && plan.credits > 0;

  return (
    <div className="p-3 sm:p-4 border rounded-lg text-center relative bg-card hover:shadow-md transition-shadow">
      {plan.credits >= 100 && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs">
          Best Value
        </Badge>
      )}
      
      <div className="flex items-center justify-center mb-2 sm:mb-3">
        <Coins className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
        <div className="text-xl sm:text-2xl font-bold">{plan.credits}</div>
      </div>
      
      <div className="text-xs sm:text-sm text-muted-foreground mb-2">Credits</div>
      
      <div className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
        {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
      </div>
      
      {price > 0 && (
        <div className="text-xs text-muted-foreground mb-3 sm:mb-4">
          ${(price / plan.credits).toFixed(3)} per credit
        </div>
      )}
      
      <Button
        className="w-full text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]"
        onClick={() => onPurchase(plan)}
        variant="default"
        disabled={isProcessing || !isValidPlan}
      >
        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
};
