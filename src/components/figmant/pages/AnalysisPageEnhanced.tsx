
import React, { useEffect } from 'react';
import { AnalysisPageContainer } from './analysis/AnalysisPageContainer';
import { EnhancementDashboard } from './analysis/EnhancementDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';
import { useAIEnhancement } from '@/hooks/useAIEnhancement';

interface AnalysisPageEnhancedProps {
  selectedTemplate?: any;
  originalAnalysis?: any;
  showEnhancementDashboard?: boolean;
}

export const AnalysisPageEnhanced: React.FC<AnalysisPageEnhancedProps> = ({ 
  selectedTemplate,
  originalAnalysis,
  showEnhancementDashboard = false
}) => {
  const isMobile = useIsMobile();
  const { resetCreditCost } = useTemplateCreditStore();
  const { isEnhancing, enhancementResult, enhanceAnalysis } = useAIEnhancement();

  // Reset credit cost when leaving the page
  useEffect(() => {
    return () => {
      resetCreditCost();
    };
  }, [resetCreditCost]);

  // Auto-enhance if original analysis is provided and no enhancement exists
  useEffect(() => {
    if (originalAnalysis && !enhancementResult && !isEnhancing && showEnhancementDashboard) {
      console.log('🔄 ANALYSIS PAGE ENHANCED - Auto-enhancing analysis');
      enhanceAnalysis(originalAnalysis);
    }
  }, [originalAnalysis, enhancementResult, isEnhancing, enhanceAnalysis, showEnhancementDashboard]);

  if (showEnhancementDashboard && originalAnalysis) {
    return (
      <div className="h-full flex flex-col min-h-0 overflow-hidden">
        <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-transparent flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
                Enhanced Analysis Results
              </h1>
              <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
                AI-powered analysis with multi-service intelligence enhancement
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto px-6 pb-6">
          <EnhancementDashboard
            originalAnalysis={originalAnalysis}
            enhancedResults={enhancementResult}
            isLoading={isEnhancing}
          />
        </div>
      </div>
    );
  }

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
