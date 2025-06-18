
import React from 'react';
import { AnalysisPerformanceWidget } from './widgets/AnalysisPerformanceWidget';

interface DashboardAnalysisPerformanceSectionProps {
  analysisData: Array<{
    id: string;
    confidence_score: number;
    suggestions?: any;
  }>;
  className?: string;
}

export const DashboardAnalysisPerformanceSection: React.FC<DashboardAnalysisPerformanceSectionProps> = ({
  analysisData,
  className = ""
}) => {
  return (
    <section className={className}>
      <AnalysisPerformanceWidget 
        analysisData={analysisData}
        className="w-full"
      />
    </section>
  );
};
