
import React, { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { ConnectionStatus } from '@/types/claude';

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
  const { data: claudeSettings, isLoading: settingsLoading } = useClaudeSettings();
  const { data: prompts = [], isLoading: promptsLoading } = useClaudePromptExamples();

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

  // Determine connection status based on Claude settings
  const getConnectionStatus = (): ConnectionStatus => {
    if (settingsLoading) {
      return {
        status: 'disabled',
        icon: Clock,
        color: 'text-gray-500',
        text: 'Loading...'
      };
    }

    if (!claudeSettings?.claude_ai_enabled || !claudeSettings?.claude_api_key) {
      return {
        status: 'disabled',
        icon: XCircle,
        color: 'text-red-500',
        text: 'Disabled'
      };
    }

    return {
      status: 'ready',
      icon: CheckCircle,
      color: 'text-green-500',
      text: 'Connected'
    };
  };

  // Group prompts by category
  const groupedPrompts = prompts.reduce((acc, prompt) => {
    const category = prompt.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(prompt);
    return acc;
  }, {} as Record<string, typeof prompts>);

  const connectionStatus = getConnectionStatus();

  if (promptsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<LoadingSpinner />}>
        <ClaudeHeader connectionStatus={connectionStatus} />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <PromptCategoryList groupedPrompts={groupedPrompts} />
      </Suspense>
    </div>
  );
};
