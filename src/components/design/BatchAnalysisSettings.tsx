
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { DesignBatchAnalysis } from '@/types/design';

interface BatchAnalysisSettingsProps {
  selectedVersion: DesignBatchAnalysis;
}

export const BatchAnalysisSettings = ({ selectedVersion }: BatchAnalysisSettingsProps) => {
  if (!selectedVersion.analysis_settings) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Settings className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No analysis settings available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Analysis Configuration
        </CardTitle>
        <CardDescription>Settings used for this batch analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Uploads Count</p>
            <p>{selectedVersion.analysis_settings.uploads_count}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Context Files</p>
            <p>{selectedVersion.analysis_settings.context_files_count || 0}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Analysis Depth</p>
            <p className="capitalize">{selectedVersion.analysis_settings.analysis_depth || 'detailed'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
