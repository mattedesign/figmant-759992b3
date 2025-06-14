
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const BatchAnalysisDashboard = lazy(() => import('@/components/design/BatchAnalysisDashboard').then(module => ({
  default: module.BatchAnalysisDashboard
})));

export const BatchAnalysisTab = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Batch Analysis</h1>
          <p className="text-muted-foreground">
            Analyze multiple designs simultaneously for comprehensive insights
          </p>
        </div>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <BatchAnalysisDashboard />
      </Suspense>
    </div>
  );
};
