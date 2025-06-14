
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const PromptsPage = lazy(() => import('@/components/design/PromptsPage').then(module => ({
  default: module.PromptsPage
})));

export const PromptsTab = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PromptsPage />
    </Suspense>
  );
};
