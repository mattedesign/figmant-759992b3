
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';
import { AnalysisMetrics } from './AnalysisMetrics';
import { IndividualAnalysesInsightsList } from './IndividualAnalysesInsightsList';
import { BatchAnalysesInsightsList } from './BatchAnalysesInsightsList';

interface AnalysisInsightsProps {
  uploads: DesignUpload[];
  recentUploads: DesignUpload[];
  recentBatchAnalyses: DesignBatchAnalysis[];
  onViewAnalysis: (upload: DesignUpload) => void;
  onViewBatchAnalysis?: (batchAnalysis: DesignBatchAnalysis) => void;
}

export const AnalysisInsights: React.FC<AnalysisInsightsProps> = ({
  uploads,
  recentUploads,
  recentBatchAnalyses,
  onViewAnalysis,
  onViewBatchAnalysis
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Insights</CardTitle>
          <CardDescription>
            Key insights and patterns from your design analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnalysisMetrics
              totalAnalyses={uploads.length}
              batchAnalysesCount={recentBatchAnalyses.length}
              completedAnalyses={recentUploads.length}
            />
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Recent Analysis Results</h4>
              <Tabs defaultValue="individual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="individual">Individual</TabsTrigger>
                  <TabsTrigger value="batch">Batch</TabsTrigger>
                </TabsList>
                
                <TabsContent value="individual" className="mt-4">
                  <IndividualAnalysesInsightsList
                    uploads={recentUploads.slice(0, 3)}
                    onViewAnalysis={onViewAnalysis}
                  />
                </TabsContent>
                
                <TabsContent value="batch" className="mt-4">
                  <BatchAnalysesInsightsList
                    batchAnalyses={recentBatchAnalyses.slice(0, 3)}
                    onViewBatchAnalysis={onViewBatchAnalysis}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
