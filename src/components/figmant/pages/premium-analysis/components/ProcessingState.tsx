
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStateProps {
  selectedTemplateTitle?: string;
  debugLogs: string[];
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  selectedTemplateTitle,
  debugLogs
}) => {
  return (
    <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto" />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Analyzing your project...</h3>
        <p className="text-gray-600">
          Using {selectedTemplateTitle || 'selected'} analysis framework
        </p>
        <div className="text-sm text-gray-500">
          This may take up to 2 minutes for comprehensive results
        </div>
        
        {/* Debug logs section during processing */}
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
            View Debug Logs ({debugLogs.length})
          </summary>
          <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono">
            {debugLogs.map((log, index) => (
              <div key={index} className="text-gray-600">{log}</div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};
