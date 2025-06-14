
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const UserManagement = lazy(() => import('@/components/owner/UserManagement').then(module => ({
  default: module.UserManagement
})));

export const UserManagementTab = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Suspense fallback={<LoadingSpinner />}>
        <UserManagement />
      </Suspense>
    </div>
  );
};
