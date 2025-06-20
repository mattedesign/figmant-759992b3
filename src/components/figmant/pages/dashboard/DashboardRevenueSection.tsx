
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
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const DashboardRevenueSection: React.FC<DashboardRevenueSectionProps> = ({
  analysisData,
  realData,
  className = ""
}) => {
  return (
    <section className={className}>
      <RevenueImpactTracker 
        analysisData={analysisData}
        realData={realData}
        className="w-full"
      />
    </section>
  );
};
