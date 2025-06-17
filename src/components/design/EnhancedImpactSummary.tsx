
import React from 'react';
import { ComprehensiveImpactSummary } from './ComprehensiveImpactSummary';
import { ImpactSummary as ImpactSummaryType } from '@/hooks/batch-upload/impactSummaryGenerator';

interface EnhancedImpactSummaryProps {
  impactSummary?: ImpactSummaryType;
  designImageUrl?: string;
  designFileName?: string;
  winnerUploadId?: string;
  className?: string;
  analysisData?: any;
}

export const EnhancedImpactSummary: React.FC<EnhancedImpactSummaryProps> = ({ 
  impactSummary,
  analysisData,
  designImageUrl,
  designFileName,
  winnerUploadId,
  className = '' 
}) => {
  // Use the new comprehensive impact summary with enhanced data
  const enhancedAnalysisData = {
    ...analysisData,
    impact_summary: impactSummary,
    analysis_type: analysisData?.analysis_type || 'master'
  };

  return (
    <ComprehensiveImpactSummary
      analysisData={enhancedAnalysisData}
      designImageUrl={designImageUrl}
      designFileName={designFileName}
      winnerUploadId={winnerUploadId}
      className={className}
    />
  );
};
