
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DesignBatchAnalysis } from '@/types/design';

interface BatchAnalysisResultsProps {
  selectedVersion: DesignBatchAnalysis;
}

export const BatchAnalysisResults = ({ selectedVersion }: BatchAnalysisResultsProps) => {
  const analysisResults = selectedVersion.analysis_results?.response || 'No analysis results available.';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Analysis Results</CardTitle>
        <CardDescription>
          AI-powered insights comparing all designs in this batch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
            {analysisResults}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
