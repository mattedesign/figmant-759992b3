
import React from 'react';
import { usePersistentChatSession } from '@/hooks/usePersistentChatSession';
import { PersistentChatInterface } from './chat2/PersistentChatInterface';
import { ChatStateProvider } from './analysis/components/ChatStateProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <Card className="p-6 m-4">
    <div className="flex items-center gap-3 text-red-600 mb-4">
      <AlertTriangle className="h-5 w-5" />
      <h3 className="font-semibold">Chat Error</h3>
    </div>
    <p className="text-gray-600 mb-4">Something went wrong with the chat interface.</p>
    <details className="mb-4">
      <summary className="cursor-pointer text-sm text-gray-500">Error details</summary>
      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
        {error.message}
      </pre>
    </details>
    <Button onClick={resetErrorBoundary} variant="outline" size="sm">
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </Card>
);

export const Chat2Page: React.FC = () => {
  const sessionHook = usePersistentChatSession();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Figmant Chat</h1>
            <p className="text-gray-600 text-sm">AI-powered design analysis and insights</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {sessionHook.currentSession ? (
              <>
                <span>Session: {sessionHook.currentSession.session_name}</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </>
            ) : (
              <>
                <span>Initializing...</span>
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ErrorBoundary FallbackComponent={ChatErrorFallback}>
          <ChatStateProvider>
            <PersistentChatInterface sessionHook={sessionHook} />
          </ChatStateProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};
