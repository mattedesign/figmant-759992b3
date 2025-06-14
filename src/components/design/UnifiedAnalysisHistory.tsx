
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

  // Filter completed uploads and get their analyses
  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const recentIndividualAnalyses = individualAnalyses
    .filter(analysis => analysis.impact_summary)
    .slice(0, limit);
  
  const recentBatchAnalyses = batchAnalyses
    .filter(analysis => analysis.impact_summary)
    .slice(0, limit);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
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
              <div className="space-y-3">
                {recentIndividualAnalyses.map((analysis) => {
                  const upload = uploads.find(u => u.id === analysis.design_upload_id);
                  const overallScore = analysis.impact_summary?.key_metrics?.overall_score || 0;
                  
                  return (
                    <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileImage className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{upload?.file_name || 'Unknown Design'}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{analysis.analysis_type}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(analysis.created_at))} ago</span>
                            {overallScore > 0 && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  Score: {overallScore}/10
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          Individual
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewIndividualAnalysis(analysis)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="batch" className="mt-4">
              <div className="space-y-3">
                {recentBatchAnalyses.length === 0 ? (
                  <div className="text-center py-4">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No batch analyses yet</p>
                  </div>
                ) : (
                  recentBatchAnalyses.map((batchAnalysis) => {
                    const overallScore = batchAnalysis.impact_summary?.key_metrics?.overall_score || 0;
                    
                    return (
                      <div key={batchAnalysis.id} className="flex items-center justify-between p-3 border rounded-lg border-l-4 border-l-blue-500 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm flex items-center gap-2">
                              Batch Comparative Analysis
                              {batchAnalysis.version_number && batchAnalysis.version_number > 1 && (
                                <Badge variant="outline" className="text-xs">
                                  v{batchAnalysis.version_number}
                                </Badge>
                              )}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{batchAnalysis.analysis_type}</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(batchAnalysis.created_at))} ago</span>
                              {overallScore > 0 && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    Score: {overallScore}/10
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            Batch
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBatchAnalysis(batchAnalysis)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    );
                  })
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
