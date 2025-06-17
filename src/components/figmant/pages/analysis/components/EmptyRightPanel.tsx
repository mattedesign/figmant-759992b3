
import React from 'react';
import { FileText, Upload, Sparkles } from 'lucide-react';

export const EmptyRightPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Empty state content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ready for Analysis
        </h3>
        
        <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
          Upload files, add URLs, or start a conversation to see analysis details here
        </p>
        
        <div className="space-y-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Upload className="h-3 w-3 flex-shrink-0" />
            <span className="break-words">Add attachments to get started</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 flex-shrink-0" />
            <span className="break-words">Use templates for guided analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
