
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
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        {creditPlans.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
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
  );
};
