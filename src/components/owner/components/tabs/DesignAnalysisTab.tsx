
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const AdvancedDesignAnalysisPageContent = lazy(() => import('@/components/design/AdvancedDesignAnalysisPageContent').then(module => ({
  default: module.AdvancedDesignAnalysisPageContent
})));

export const DesignAnalysisTab = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Suspense fallback={<LoadingSpinner />}>
          <AdvancedDesignAnalysisPageContent />
        </Suspense>
      </div>
    </div>
  );
};
