
import React from 'react';
import { RevenueImpactTracker } from './widgets/RevenueImpactTracker';

interface DashboardRevenueSectionProps {
  analysisData: any[];
  className?: string;
}

export const DashboardRevenueSection: React.FC<DashboardRevenueSectionProps> = ({
  analysisData,
  className
}) => {
  return (
    <div className={className}>
      <RevenueImpactTracker analysisData={analysisData} />
    </div>
  );
};
