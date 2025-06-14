
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DesignUpload, DesignAnalysis } from '@/types/design';
import { Eye, FileImage } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisListItemProps {
  upload: DesignUpload;
  analysis?: DesignAnalysis;
  onViewAnalysis: (upload: DesignUpload) => void;
  getStatusColor: (status: string) => string;
}

export const AnalysisListItem: React.FC<AnalysisListItemProps> = ({
  upload,
  analysis,
  onViewAnalysis,
  getStatusColor
}) => {
  const overallScore = analysis?.impact_summary?.key_metrics?.overall_score || 0;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <FileImage className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">{upload.file_name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{upload.use_case}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(upload.created_at))} ago</span>
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
        <Badge variant={getStatusColor(upload.status) as any}>
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
  );
};
