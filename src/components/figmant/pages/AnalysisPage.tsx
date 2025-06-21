
import React, { useEffect } from 'react';
import { AnalysisPageContainer } from './analysis/AnalysisPageContainer';
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
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-transparent flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
              Analysis Management
            </h1>
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
              View and manage your design analysis history
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <AnalysisPageContainer selectedTemplate={selectedTemplate} />
      </div>
    </div>
  );
};
