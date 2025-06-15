
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Lazy load with better error handling
const AllAnalysisPageLazy = React.lazy(() => 
  import('@/components/design/AllAnalysisPage')
    .then(module => {
      console.log('AllAnalysisPage loaded successfully');
      return { default: module.default };
    })
    .catch(error => {
      console.error('Failed to load AllAnalysisPage:', error);
      throw error;
    })
);

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const { toast } = useToast();

  const handleReload = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    resetErrorBoundary();
    toast({
      title: "Retrying...",
      description: "Attempting to reload the analysis page.",
    });
  };

  return (
    <div className="p-6 h-full flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Analysis Page Error</span>
          </CardTitle>
          <CardDescription>
            There was an error loading the analysis page. This might be due to a temporary loading issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-800 font-medium">Error:</p>
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleRetry} variant="outline">
              Try Again
            </Button>
            <Button onClick={handleReload} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Reload Page</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LoadingFallback: React.FC = () => {
  return (
    <div className="p-6 h-full">
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-32 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-64 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
};

export const AllAnalysisPageWrapper: React.FC = () => {
  const [retryKey, setRetryKey] = useState(0);
  const { toast } = useToast();

  // Monitor for module loading errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Failed to fetch dynamically imported module')) {
        console.error('Module loading error detected:', event);
        toast({
          variant: "destructive",
          title: "Loading Error",
          description: "Failed to load analysis components. Please try refreshing the page.",
        });
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [toast]);

  const handleReset = () => {
    setRetryKey(prev => prev + 1);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={handleReset}
      resetKeys={[retryKey]}
      onError={(error) => {
        console.error('AllAnalysisPage Error Boundary caught error:', error);
      }}
    >
      <React.Suspense fallback={<LoadingFallback />}>
        <AllAnalysisPageLazy key={retryKey} />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default AllAnalysisPageWrapper;
