
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, Users, Eye } from 'lucide-react';
import { DesignUpload } from '@/types/design';
import { formatDistanceToNow } from 'date-fns';

interface BatchAnalysisCardProps {
  batchId: string;
  batchName?: string;
  uploads: DesignUpload[];
  onViewBatchAnalysis: (batchId: string) => void;
  onViewIndividualAnalysis: (upload: DesignUpload) => void;
}

export const BatchAnalysisCard = ({ 
  batchId, 
  batchName, 
  uploads, 
  onViewBatchAnalysis, 
  onViewIndividualAnalysis 
}: BatchAnalysisCardProps) => {
  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const hasComparativeAnalysis = uploads.length > 1 && completedUploads.length > 1;
  const mostRecentUpload = uploads.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              {batchName || `Batch Analysis`}
            </CardTitle>
            <CardDescription>
              {uploads.length} designs • {formatDistanceToNow(new Date(mostRecentUpload.created_at))} ago
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Batch
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Batch Summary */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{uploads.length} designs</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{completedUploads.length} completed</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span>{hasComparativeAnalysis ? 'Comparative' : 'Individual'}</span>
            </div>
          </div>

          {/* Individual Designs Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Designs in this batch:</p>
            <div className="space-y-1">
              {uploads.slice(0, 3).map((upload) => (
                <div key={upload.id} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{upload.file_name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={upload.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {upload.status}
                    </Badge>
                    {upload.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewIndividualAnalysis(upload)}
                        className="h-6 px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {uploads.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{uploads.length - 3} more designs...
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {hasComparativeAnalysis && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onViewBatchAnalysis(batchId)}
                className="flex-1"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Batch Analysis
              </Button>
            )}
            {!hasComparativeAnalysis && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="flex-1"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Comparative Analysis Pending
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
