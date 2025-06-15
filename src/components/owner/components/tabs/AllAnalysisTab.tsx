
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const AllAnalysisPage = lazy(() => import('@/components/design/AllAnalysisPage'));

export const AllAnalysisTab = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AllAnalysisPage />
    </Suspense>
  );
};
