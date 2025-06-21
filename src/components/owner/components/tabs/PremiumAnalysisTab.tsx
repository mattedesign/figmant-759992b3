
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const PremiumAnalysisPage = lazy(() => import('@/components/design/PremiumAnalysisPage').then(module => ({
  default: module.PremiumAnalysisPage
})));

export const PremiumAnalysisTab = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PremiumAnalysisPage />
    </Suspense>
  );
};
