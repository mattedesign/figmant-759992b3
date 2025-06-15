
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const DesignChatInterface = lazy(() => import('@/components/design/DesignChatInterface').then(module => ({
  default: module.DesignChatInterface
})));

export const DesignAnalysisTab = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Suspense fallback={<LoadingSpinner />}>
          <DesignChatInterface />
        </Suspense>
      </div>
    </div>
  );
};
