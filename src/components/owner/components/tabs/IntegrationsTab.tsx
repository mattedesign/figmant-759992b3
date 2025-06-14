
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const IntegrationsPage = lazy(() => import('@/components/design/IntegrationsPage').then(module => ({
  default: module.IntegrationsPage
})));

export const IntegrationsTab = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <IntegrationsPage />
    </Suspense>
  );
};
