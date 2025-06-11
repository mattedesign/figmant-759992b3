
import React from 'react';
import { AnalysisPreferences } from '@/types/design';

interface UploadSummaryProps {
  selectedFiles: File[];
  validUrls: string[];
  contextFiles: File[];
  analysisGoals: string;
  analysisPreferences: AnalysisPreferences;
  hasValidContent: boolean;
}

export const UploadSummary = ({
  selectedFiles,
  validUrls,
  contextFiles,
  analysisGoals,
  analysisPreferences,
  hasValidContent
}: UploadSummaryProps) => {
  if (!hasValidContent) return null;

  const totalItems = selectedFiles.length + validUrls.length;

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h4 className="font-medium mb-2">Upload Summary</h4>
      <div className="text-sm text-muted-foreground space-y-1">
        {selectedFiles.length > 0 && (
          <div>• {selectedFiles.length} design file(s) selected</div>
        )}
        {validUrls.length > 0 && (
          <div>• {validUrls.length} URL(s) to analyze</div>
        )}
        {contextFiles.length > 0 && (
          <div>• {contextFiles.length} context file(s) for enhanced analysis</div>
        )}
        <div>• Total design items: {totalItems}</div>
        {totalItems > 1 && analysisPreferences.auto_comparative && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 border border-blue-200">
            <strong>✨ Comparative Analysis:</strong> Multiple items detected - automatic comparative analysis will be performed
          </div>
        )}
        {analysisGoals && (
          <div className="mt-2 p-2 bg-green-50 rounded text-green-800 border border-green-200">
            <strong>Goals:</strong> {analysisGoals.slice(0, 100)}
            {analysisGoals.length > 100 && '...'}
          </div>
        )}
      </div>
    </div>
  );
};
