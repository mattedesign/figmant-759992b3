
import React from 'react';
import { CompetitorAnalysisOverview } from './widgets/CompetitorAnalysisOverview';

interface DashboardCompetitorSectionProps {
  analysisData: Array<{
    id: string;
    source_type: 'file' | 'url';
    confidence_score: number;
    source_url?: string;
    design_analysis?: Array<{
      confidence_score: number;
      suggestions?: any;
      improvement_areas?: string[];
    }>;
  }>;
  userCredits?: {
    current_balance: number;
    total_used: number;
  };
  className?: string;
}

export const DashboardCompetitorSection: React.FC<DashboardCompetitorSectionProps> = ({
  analysisData,
  userCredits,
  className = ""
}) => {
  return (
    <section className={className}>
      <CompetitorAnalysisOverview 
        analysisData={analysisData}
        userCredits={userCredits}
        className="w-full"
      />
    </section>
  );
};
