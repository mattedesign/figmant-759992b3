
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DesignBatchAnalysis } from '@/types/design';
import { EnhancedImpactSummary } from './EnhancedImpactSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignUploads } from '@/hooks/useDesignUploads';

interface BatchAnalysisResultsProps {
  selectedVersion: DesignBatchAnalysis;
}

export const BatchAnalysisResults = ({ selectedVersion }: BatchAnalysisResultsProps) => {
  const { data: uploads } = useDesignUploads();
  const analysisResults = selectedVersion.analysis_results?.response || 'No analysis results available.';
  const hasImpactSummary = selectedVersion.impact_summary;
  
  // Find winner upload details
  const winnerUpload = selectedVersion.winner_upload_id 
    ? uploads?.find(u => u.id === selectedVersion.winner_upload_id)
    : null;

  return (
    <div className="space-y-6">
      {hasImpactSummary && (
        <EnhancedImpactSummary 
          impactSummary={selectedVersion.impact_summary} 
          winnerUploadId={selectedVersion.winner_upload_id || undefined}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Comparative Analysis Results</CardTitle>
          <CardDescription>
            AI-powered insights comparing all designs in this batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasImpactSummary ? (
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="raw">Raw Response</TabsTrigger>
              </TabsList>
              <TabsContent value="analysis" className="space-y-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {analysisResults}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="raw" className="space-y-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg font-mono">
                    {JSON.stringify(selectedVersion.analysis_results, null, 2)}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                {analysisResults}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
