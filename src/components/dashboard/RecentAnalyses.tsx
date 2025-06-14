
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';
import { Eye, FileImage, BarChart3, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentAnalysesProps {
  onViewAnalysis: (upload: DesignUpload) => void;
  onViewBatchAnalysis?: (batchAnalysis: DesignBatchAnalysis) => void;
  limit?: number;
  showInsights?: boolean;
}

export const RecentAnalyses = ({ 
  onViewAnalysis, 
  onViewBatchAnalysis,
  limit = 5, 
  showInsights = false 
}: RecentAnalysesProps) => {
  const { data: uploads = [], isLoading } = useDesignUploads();
  const { data: individualAnalyses = [] } = useDesignAnalyses();
  const { data: batchAnalyses = [] } = useDesignBatchAnalyses();

  // Filter uploads with completed analyses that have impact summaries
  const recentUploads = uploads
    .filter(upload => upload.status === 'completed')
    .slice(0, limit);

  // Filter batch analyses that have impact summaries
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (recentUploads.length === 0 && recentBatchAnalyses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {showInsights ? 'No analysis insights available yet' : 'No completed analyses yet'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload a design to get started with AI-powered analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showInsights) {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Total Analyses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{uploads.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {recentBatchAnalyses.length} batch analyses
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {uploads.length > 0 ? Math.round((recentUploads.length / uploads.length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Successful analyses
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Recent Analysis Results</h4>
                <Tabs defaultValue="individual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="batch">Batch</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="individual" className="mt-4">
                    <div className="space-y-2">
                      {recentUploads.slice(0, 3).map((upload) => (
                        <div key={upload.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{upload.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {upload.use_case} • {formatDistanceToNow(new Date(upload.created_at))} ago
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewAnalysis(upload)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="batch" className="mt-4">
                    <div className="space-y-2">
                      {recentBatchAnalyses.slice(0, 3).map((batchAnalysis) => (
                        <div key={batchAnalysis.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              Batch Analysis
                              {batchAnalysis.version_number && batchAnalysis.version_number > 1 && (
                                <Badge variant="outline" className="text-xs">
                                  v{batchAnalysis.version_number}
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {batchAnalysis.analysis_type} • {formatDistanceToNow(new Date(batchAnalysis.created_at))} ago
                            </p>
                          </div>
                          {onViewBatchAnalysis && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewBatchAnalysis(batchAnalysis)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual ({recentUploads.length})</TabsTrigger>
          <TabsTrigger value="batch">Batch ({recentBatchAnalyses.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual" className="mt-4">
          <div className="space-y-3">
            {recentUploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileImage className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{upload.file_name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{upload.use_case}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(upload.created_at))} ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(upload.status)}>
                    {upload.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAnalysis(upload)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
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
                  <div key={batchAnalysis.id} className="flex items-center justify-between p-3 border rounded-lg border-l-4 border-l-blue-500">
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
                      {onViewBatchAnalysis && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewBatchAnalysis(batchAnalysis)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {(uploads.length > limit || recentBatchAnalyses.length > limit) && (
        <div className="text-center pt-2">
          <Button variant="outline" size="sm">
            View All Analyses
          </Button>
        </div>
      )}
    </div>
  );
};
