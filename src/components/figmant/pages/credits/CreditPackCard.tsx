
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Coins, Check } from 'lucide-react';
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
    <div className="p-4 border rounded-lg text-center relative">
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
        onClick={() => onPurchase(plan)}
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
};
