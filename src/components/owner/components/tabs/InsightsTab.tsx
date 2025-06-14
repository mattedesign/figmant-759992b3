
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const InsightsPage = lazy(() => import('@/components/design/InsightsPage').then(module => ({
  default: module.InsightsPage
})));

export const InsightsTab = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <InsightsPage />
    </Suspense>
  );
};
