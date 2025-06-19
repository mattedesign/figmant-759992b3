
import React from 'react';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { AnalysisInsights } from './AnalysisInsights';

interface AnalysisInsightsSectionProps {
  lastAnalysisResult?: any;
  analysisMessages: ChatMessage[];
}

export const AnalysisInsightsSection: React.FC<AnalysisInsightsSectionProps> = ({
  lastAnalysisResult,
  analysisMessages
}) => {
  if (!lastAnalysisResult && analysisMessages.length === 0) return null;

  return (
    <div className="mt-2 px-3">
      <AnalysisInsights 
        analysisResult={lastAnalysisResult}
        analysisMessages={analysisMessages}
      />
    </div>
  );
};
