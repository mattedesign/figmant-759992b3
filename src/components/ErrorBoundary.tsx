
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Something went wrong</h2>
        <pre className="text-red-600 bg-red-100 p-4 rounded text-sm max-w-md overflow-auto">
          {error.message}
        </pre>
      </div>
    </div>
  );
}

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};
