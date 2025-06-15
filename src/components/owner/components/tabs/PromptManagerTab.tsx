
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const ClaudePromptManager = lazy(() => import('@/components/owner/claude/ClaudePromptManager').then(module => ({
  default: module.ClaudePromptManager
})));

export const PromptManagerTab = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Suspense fallback={<LoadingSpinner />}>
        <ClaudePromptManager />
      </Suspense>
    </div>
  );
};
