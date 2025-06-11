
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DesignUpload } from '@/types/design';

interface BatchAnalysisDesignsProps {
  batchUploads: DesignUpload[];
}

export const BatchAnalysisDesigns = ({ batchUploads }: BatchAnalysisDesignsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyzed Designs</CardTitle>
        <CardDescription>Individual designs included in this batch analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {batchUploads.map((upload, index) => (
            <div key={upload.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{upload.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {upload.source_type === 'file' ? 'File Upload' : 'URL Analysis'}
                </p>
              </div>
              <Badge variant={upload.status === 'completed' ? 'default' : 'secondary'}>
                {upload.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
