
import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  errorMessage?: string;
  selectedType: string;
  hasSelectedTemplate: boolean;
  debugLogs: string[];
  onRetry: () => void;
  onBackToAnalysis: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  selectedType,
  hasSelectedTemplate,
  debugLogs,
  onRetry,
  onBackToAnalysis
}) => {
  return (
    <div className="space-y-6 flex-1 flex flex-col justify-center">
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-red-600">Analysis Failed</h3>
          <p className="text-gray-600">
            There was an error processing your premium analysis
          </p>
          {errorMessage && (
            <p className="text-sm text-red-500 mt-2">
              Error: {errorMessage}
            </p>
          )}
          {!hasSelectedTemplate && (
            <p className="text-sm text-red-500 mt-2">
              Template with ID "{selectedType}" not found
            </p>
          )}
        </div>
      </div>
      
      {/* Debug logs section for errors */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
        <h4 className="font-medium text-red-800 mb-2">Debug Information:</h4>
        <div className="max-h-48 overflow-y-auto bg-white p-2 rounded text-xs font-mono">
          {debugLogs.map((log, index) => (
            <div key={index} className={`${log.includes('ERROR') ? 'text-red-600' : 'text-gray-600'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
          Retry Analysis
        </Button>
        <Button variant="outline" onClick={onBackToAnalysis}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analysis
        </Button>
      </div>
    </div>
  );
};
