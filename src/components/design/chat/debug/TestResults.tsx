
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResultsProps {
  testResults: any[];
  onClearResults: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  testResults,
  onClearResults
}) => {
  const { toast } = useToast();

  const clearTestResults = () => {
    onClearResults();
    toast({
      title: "Test Results Cleared",
      description: "All test results have been removed.",
    });
  };

  if (testResults.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-medium text-gray-600">Test Results:</h5>
        <Button
          size="sm"
          onClick={clearTestResults}
          variant="outline"
          className="text-xs"
        >
          Clear Results ({testResults.length})
        </Button>
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="bg-gray-50 rounded border p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant={result.success ? 'default' : 'destructive'} className="text-xs">
                  {result.success ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {result.type}
                </Badge>
                <span className="text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
                {result.responseTime && (
                  <span className="text-blue-600 text-xs">
                    {result.responseTime}ms
                  </span>
                )}
              </div>
            </div>
            
            {result.url && (
              <div className="mb-2">
                <span className="font-medium">URL:</span> {result.url}
              </div>
            )}
            
            {result.fileName && (
              <div className="mb-2">
                <span className="font-medium">File:</span> {result.fileName} 
                {result.fileSize && <span className="text-gray-500"> ({(result.fileSize / 1024 / 1024).toFixed(2)} MB)</span>}
              </div>
            )}
            
            <div className="mb-2">
              <span className="font-medium">Message:</span> {result.message}
            </div>
            
            {result.success ? (
              <div>
                <span className="font-medium">Response Length:</span> {result.responseLength} chars
                <div className="mt-1 p-2 bg-white rounded border max-h-20 overflow-y-auto">
                  {result.response.substring(0, 200)}...
                </div>
                {result.debugInfo && (
                  <div className="mt-2 p-2 bg-blue-50 rounded border">
                    <div className="font-medium text-blue-800 mb-1">Debug Info:</div>
                    <div className="text-blue-700 text-xs">
                      Images Processed: {result.debugInfo.imagesProcessed || 0} | 
                      Tokens Used: {result.debugInfo.tokensUsed || 0} | 
                      Response Time: {result.responseTime || 0}ms
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                <span className="font-medium">Error:</span> {result.error}
                {result.error?.includes('Maximum call stack') && (
                  <div className="mt-1 p-2 bg-red-50 rounded border">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    <span className="text-xs">This error indicates a problem with the image download function. The fix has been implemented.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
