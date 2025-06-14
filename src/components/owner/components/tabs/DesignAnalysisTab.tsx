
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const DesignChatInterface = lazy(() => import('@/components/design/DesignChatInterface').then(module => ({
  default: module.DesignChatInterface
})));

export const DesignAnalysisTab = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Design Analysis</h1>
          <p className="text-muted-foreground">
            Chat with AI for comprehensive UX insights and design analysis
          </p>
        </div>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <DesignChatInterface />
      </Suspense>
    </div>
  );
};
