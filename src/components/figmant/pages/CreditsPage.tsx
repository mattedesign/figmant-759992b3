
import React from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useCreditPurchase } from '@/hooks/useCreditPurchase';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/types/subscription';
import { CreditsPageHeader } from './credits/CreditsPageHeader';
import { CreditStatusCard } from './credits/CreditStatusCard';
import { UsageSummaryCard } from './credits/UsageSummaryCard';
import { CreditPacksList } from './credits/CreditPacksList';

export const CreditsPage: React.FC = () => {
  const {
    credits
  } = useUserCredits();
  const {
    plans
  } = useSubscriptionPlans();
  const {
    handlePurchaseCredits,
    isProcessing
  } = useCreditPurchase();
  const {
    toast
  } = useToast();
  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;
  const totalUsed = credits?.total_used || 0;

  // Only show credit-based plans
  const creditPlans = plans?.filter(plan => plan.plan_type === 'credits' && plan.is_active) || [];
  const onPurchaseCredits = async (plan: SubscriptionPlan) => {
    try {
      console.log('Purchase button clicked for plan:', plan);

      // Calculate price based on credit_price or fallback
      const price = plan.credit_price || plan.price_monthly || 0;
      if (price <= 0) {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "This credit pack is not properly configured. Please contact support."
        });
        return;
      }
      await handlePurchaseCredits(plan.id, plan.name, plan.credits, price);
    } catch (error) {
      console.error('Error in onPurchaseCredits:', error);
      toast({
        variant: "destructive",
        title: "Purchase Error",
        description: "Failed to start purchase process. Please try again."
      });
    }
  };
  return <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 h-full overflow-y-auto">
      <CreditsPageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CreditStatusCard currentBalance={currentBalance} totalPurchased={totalPurchased} />

        <UsageSummaryCard totalPurchased={totalPurchased} totalUsed={totalUsed} currentBalance={currentBalance} />
      </div>

      <CreditPacksList creditPlans={creditPlans} onPurchase={onPurchaseCredits} isProcessing={isProcessing} />
    </div>;
};
