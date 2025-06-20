
import React from 'react';
import { AnalysisPageContainer } from './analysis/AnalysisPageContainer';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const getHeaderClasses = () => {
    if (isMobile) {
      return "px-3 pt-4 pb-3 bg-transparent flex-shrink-0";
    }
    if (isTablet) {
      return "px-4 pt-5 pb-3 bg-transparent flex-shrink-0";
    }
    return "px-6 pt-6 pb-3 bg-transparent flex-shrink-0";
  };

  const getTitleClasses = () => {
    if (isMobile) {
      return "text-xl font-bold text-gray-900";
    }
    return "text-2xl font-bold text-gray-900";
  };

  const getSubtitleClasses = () => {
    if (isMobile) {
      return "text-gray-600 mt-1 text-sm";
    }
    return "text-gray-600 mt-1";
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className={getHeaderClasses()}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={getTitleClasses()}>
              Analysis Management
            </h1>
            <p className={getSubtitleClasses()}>
              {isMobile ? 'Manage analysis history' : 'View and manage your design analysis history'}
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
