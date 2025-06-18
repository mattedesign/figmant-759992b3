import React from 'react';
import { RevenueImpactTracker } from './widgets';

interface DashboardRevenueSectionProps {
  analysisData: Array<{
    id: string;
    confidence_score: number;
    impact_summary?: {
      business_impact?: {
        conversion_potential: number;
      };
    };
    suggestions?: any;
  }>;
  className?: string;
}

export const DashboardRevenueSection: React.FC<DashboardRevenueSectionProps> = ({
  analysisData,
  className = ""
}) => {
  return (
    <section className={className}>
      <RevenueImpactTracker 
        analysisData={analysisData}
        className="w-full"
      />
    </section>
  );
};
