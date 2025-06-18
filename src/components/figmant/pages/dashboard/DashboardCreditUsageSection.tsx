
import React from 'react';
import { CreditUsageWidget } from './widgets/CreditUsageWidget';

interface DashboardCreditUsageSectionProps {
  userCredits?: {
    current_balance: number;
    total_used: number;
    total_purchased: number;
  };
  className?: string;
}

export const DashboardCreditUsageSection: React.FC<DashboardCreditUsageSectionProps> = ({
  userCredits,
  className = ""
}) => {
  return (
    <section className={className}>
      <CreditUsageWidget 
        userCredits={userCredits}
        className="w-full"
      />
    </section>
  );
};
