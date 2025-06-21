
import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnalysisPageContainer } from './analysis/AnalysisPageContainer';
import { CompetitorAnalysisPanel } from '@/components/competitor/CompetitorAnalysisPanel';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Check if we're in competitor analysis mode
  const isCompetitorMode = location.pathname.includes('competitor-analysis');

  if (isCompetitorMode) {
    return (
      <div className="h-full flex flex-col min-h-0 overflow-hidden">
        <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-transparent flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
                Competitor Analysis
              </h1>
              <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
                Analyze competitor websites and compare design strategies
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto p-6">
          <CompetitorAnalysisPanel />
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
