
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const DesignChatInterface = lazy(() => import('@/components/design/DesignChatInterface').then(module => ({
  default: module.DesignChatInterface
})));

export const DesignAnalysisTab = () => {
  return (
    <div className="p-6 h-full flex flex-col space-y-4">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold">AI Design Analysis</h1>
        <p className="text-muted-foreground text-sm">
          Chat with AI for comprehensive UX insights and design analysis
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <Suspense fallback={<LoadingSpinner />}>
          <DesignChatInterface />
        </Suspense>
      </div>
    </div>
  );
};
