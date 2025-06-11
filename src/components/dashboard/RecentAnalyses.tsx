
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDesignUploads, useDesignUseCases } from '@/hooks/useDesignAnalysis';
import { DesignUpload } from '@/types/design';
import { Eye, FileImage, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentAnalysesProps {
  onViewAnalysis: (upload: DesignUpload) => void;
  limit?: number;
  showInsights?: boolean;
}

export const RecentAnalyses = ({ onViewAnalysis, limit = 5, showInsights = false }: RecentAnalysesProps) => {
  const { data: uploads = [], isLoading } = useDesignUploads();
  const { data: useCases = [] } = useDesignUseCases();

  const recentUploads = uploads
    .filter(upload => upload.status === 'completed')
    .slice(0, limit);

  const getUseCaseName = (useCaseId: string) => {
    const useCase = useCases.find(uc => uc.id === useCaseId);
    return useCase?.name || 'Unknown';
  };

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

  if (recentUploads.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
                    <CardTitle className="text-base">Most Analyzed Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">Landing Pages</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((recentUploads.length / uploads.length) * 100)}% of your uploads
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Analysis Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {Math.round((recentUploads.length / uploads.length) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Successful analyses
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Recent Analysis Results</h4>
                <div className="space-y-2">
                  {recentUploads.slice(0, 3).map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{upload.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getUseCaseName(upload.use_case)} • {formatDistanceToNow(new Date(upload.created_at))} ago
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentUploads.map((upload) => (
        <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <FileImage className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{upload.file_name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{getUseCaseName(upload.use_case)}</span>
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
      
      {uploads.length > limit && (
        <div className="text-center pt-2">
          <Button variant="outline" size="sm">
            View All Analyses
          </Button>
        </div>
      )}
    </div>
  );
};
