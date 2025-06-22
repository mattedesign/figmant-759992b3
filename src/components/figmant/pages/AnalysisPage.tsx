
import React, { useEffect } from 'react';
import { UnifiedChatContainer } from './analysis/components/UnifiedChatContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  const isMobile = useIsMobile();
  const { resetCreditCost } = useTemplateCreditStore();

  // Reset credit cost when leaving the page
  useEffect(() => {
    return () => {
      resetCreditCost();
    };
  }, [resetCreditCost]);

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-white">
      {/* Simple Header */}
      <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-white border-b border-gray-200 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
              Design Analysis
            </h1>
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
              Upload designs and get AI-powered insights
            </p>
          </div>
        </div>
      </div>

      {/* Clean Chat Interface */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <UnifiedChatContainer />
      </div>
    </div>
  );
};
