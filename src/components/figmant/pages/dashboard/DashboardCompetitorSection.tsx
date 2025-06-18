
import React from 'react';
import { CompetitorAnalysisOverview } from './widgets/CompetitorAnalysisOverview';

interface DashboardCompetitorSectionProps {
  analysisData: any[];
  userCredits?: {
    current_balance: number;
    total_used: number;
  };
  className?: string;
}

export const DashboardCompetitorSection: React.FC<DashboardCompetitorSectionProps> = ({
  analysisData,
  userCredits,
  className
}) => {
  return (
    <div className={className}>
      <CompetitorAnalysisOverview 
        analysisData={analysisData}
        userCredits={userCredits}
      />
    </div>
  );
};
