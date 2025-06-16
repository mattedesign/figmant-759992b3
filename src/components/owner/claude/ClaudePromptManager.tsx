
import React, { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Lazy load the heavy components
const ClaudeHeader = React.lazy(() => import('./ClaudeHeader').then(module => ({ default: module.ClaudeHeader })));
const PromptCategoryList = React.lazy(() => import('./PromptCategoryList').then(module => ({ default: module.PromptCategoryList })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const ClaudePromptManager: React.FC = () => {
  const { isOwner, loading } = useAuth();

  console.log('🚀 ClaudePromptManager mounting with auth state:', { isOwner, loading });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isOwner) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the prompt manager. Owner access required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<LoadingSpinner />}>
        <ClaudeHeader />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <PromptCategoryList />
      </Suspense>
    </div>
  );
};
