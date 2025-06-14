
import React from 'react';
import { Button } from '@/components/ui/button';
import { DesignUpload } from '@/types/design';
import { Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IndividualAnalysesInsightsListProps {
  uploads: DesignUpload[];
  onViewAnalysis: (upload: DesignUpload) => void;
}

export const IndividualAnalysesInsightsList: React.FC<IndividualAnalysesInsightsListProps> = ({
  uploads,
  onViewAnalysis
}) => {
  return (
    <div className="space-y-2">
      {uploads.map((upload) => (
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
  );
};
