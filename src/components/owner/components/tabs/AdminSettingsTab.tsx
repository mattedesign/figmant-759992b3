
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const AdminSettings = lazy(() => import('@/components/owner/AdminSettings').then(module => ({
  default: module.AdminSettings
})));

export const AdminSettingsTab = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Suspense fallback={<LoadingSpinner />}>
        <AdminSettings />
      </Suspense>
    </div>
  );
};
