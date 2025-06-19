
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';
import { CreditPackCard } from './CreditPackCard';

interface CreditPacksListProps {
  creditPlans: SubscriptionPlan[];
  onPurchase: (plan: SubscriptionPlan) => void;
  isProcessing: boolean;
}

export const CreditPacksList: React.FC<CreditPacksListProps> = ({
  creditPlans,
  onPurchase,
  isProcessing
}) => {
  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Credit Packs</CardTitle>
      </CardHeader>
      <CardContent>
        {creditPlans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {creditPlans.map((plan) => (
              <CreditPackCard
                key={plan.id}
                plan={plan}
                onPurchase={onPurchase}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Coins className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No Credit Packs Available</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Credit packs are currently being configured. Please check back soon.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
