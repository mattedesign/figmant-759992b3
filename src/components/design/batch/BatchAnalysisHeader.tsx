
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2 } from 'lucide-react';

interface BatchAnalysisHeaderProps {
  batch: any;
  onBack: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export const BatchAnalysisHeader = ({ batch, onBack, onExport, onShare }: BatchAnalysisHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{batch.batch_name}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className={getStatusColor(batch.status)}>
              {batch.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created {new Date(batch.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
        {onShare && (
          <Button variant="outline" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
};
