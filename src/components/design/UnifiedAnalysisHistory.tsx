
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { DesignUpload, DesignAnalysis, DesignBatchAnalysis } from '@/types/design';
import { Eye, FileImage, BarChart3, Clock, Target, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UnifiedAnalysisResultsViewer } from './UnifiedAnalysisResultsViewer';
import { EnhancedAnalysisCard } from '@/components/figmant/analysis/EnhancedAnalysisCard';

interface UnifiedAnalysisHistoryProps {
  onViewAnalysis?: (upload: DesignUpload) => void;
  limit?: number;
}

export const UnifiedAnalysisHistory: React.FC<UnifiedAnalysisHistoryProps> = ({ 
  onViewAnalysis,
  limit = 10 
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<{
    type: 'individual' | 'batch';
    data: any;
    upload?: any;
    uploads?: any[];
  } | null>(null);

  const { data: uploads = [], isLoading: uploadsLoading } = useDesignUploads();
  const { data: individualAnalyses = [], isLoading: analysesLoading } = useDesignAnalyses();
  const { data: batchAnalyses = [], isLoading: batchLoading } = useDesignBatchAnalyses();

  const isLoading = uploadsLoading || analysesLoading || batchLoading;

  // Filter completed uploads and get their analyses - all should now have impact summaries
  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const recentIndividualAnalyses = individualAnalyses.slice(0, limit);
  const recentBatchAnalyses = batchAnalyses.slice(0, limit);

  const handleViewIndividualAnalysis = (analysis: DesignAnalysis) => {
    const upload = uploads.find(u => u.id === analysis.design_upload_id);
    setSelectedAnalysis({ 
      type: 'individual', 
      data: analysis,
      upload
    });
  };

  const handleViewBatchAnalysis = (batchAnalysis: DesignBatchAnalysis) => {
    // Get uploads for this batch
    const batchUploads = uploads.filter(u => u.batch_id === batchAnalysis.batch_id);
    setSelectedAnalysis({ 
      type: 'batch', 
      data: batchAnalysis,
      uploads: batchUploads
    });
  };

  // Transform individual analyses to enhanced card format
  const transformedIndividualAnalyses = recentIndividualAnalyses.map(analysis => {
    const upload = uploads.find(u => u.id === analysis.design_upload_id);
    return {
      ...analysis,
      type: 'design',
      title: analysis.analysis_results?.title || 'Design Analysis',
      displayTitle: `Design Analysis - ${analysis.analysis_type || 'General'}`,
      fileCount: 1,
      score: analysis.impact_summary?.key_metrics?.overall_score || 0
    };
  });

  // Transform batch analyses to enhanced card format
  const transformedBatchAnalyses = recentBatchAnalyses.map(batchAnalysis => ({
    ...batchAnalysis,
    type: 'batch',
    title: 'Batch Comparative Analysis',
    displayTitle: 'Batch Comparative Analysis',
    fileCount: uploads.filter(u => u.batch_id === batchAnalysis.batch_id).length,
    score: batchAnalysis.impact_summary?.key_metrics?.overall_score || 0
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentIndividualAnalyses.length === 0 && recentBatchAnalyses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No analysis history available yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload designs and run analyses to see results here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">
                Individual Analyses ({recentIndividualAnalyses.length})
              </TabsTrigger>
              <TabsTrigger value="batch">
                Batch Analyses ({recentBatchAnalyses.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="mt-4">
              <div className="space-y-4">
                {transformedIndividualAnalyses.length === 0 ? (
                  <div className="text-center py-4">
                    <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No individual analyses yet</p>
                  </div>
                ) : (
                  transformedIndividualAnalyses.map((analysis) => (
                    <EnhancedAnalysisCard
                      key={analysis.id}
                      analysis={analysis}
                      onViewDetails={() => handleViewIndividualAnalysis(analysis)}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="batch" className="mt-4">
              <div className="space-y-4">
                {transformedBatchAnalyses.length === 0 ? (
                  <div className="text-center py-4">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No batch analyses yet</p>
                  </div>
                ) : (
                  transformedBatchAnalyses.map((batchAnalysis) => (
                    <EnhancedAnalysisCard
                      key={batchAnalysis.id}
                      analysis={batchAnalysis}
                      onViewDetails={() => handleViewBatchAnalysis(batchAnalysis)}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Analysis Detail Dialog */}
      <Dialog open={!!selectedAnalysis} onOpenChange={() => setSelectedAnalysis(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAnalysis?.type === 'individual' ? (
                <>
                  <FileImage className="h-5 w-5" />
                  Individual Analysis Details
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Batch Analysis Details
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAnalysis && (
            <UnifiedAnalysisResultsViewer
              analysisData={selectedAnalysis.data}
              analysisType={selectedAnalysis.type}
              upload={selectedAnalysis.upload}
              uploads={selectedAnalysis.uploads}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
