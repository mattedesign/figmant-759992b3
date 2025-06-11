
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Target, FileText, Clock } from 'lucide-react';

interface BatchAnalysisSettingsProps {
  batch: any;
}

export const BatchAnalysisSettings = ({ batch }: BatchAnalysisSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Batch Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Use Case</span>
            </div>
            <Badge variant="outline">{batch.use_case || 'General Analysis'}</Badge>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-green-500" />
              <span className="font-medium">Analysis Type</span>
            </div>
            <Badge variant="outline">{batch.analysis_type || 'Standard'}</Badge>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Priority</span>
            </div>
            <Badge variant="outline">{batch.priority || 'Normal'}</Badge>
          </div>
        </div>
        
        {batch.description && (
          <div>
            <div className="font-medium mb-2">Description</div>
            <p className="text-sm text-muted-foreground">{batch.description}</p>
          </div>
        )}
        
        {batch.context_files && batch.context_files.length > 0 && (
          <div>
            <div className="font-medium mb-2">Context Files</div>
            <div className="space-y-1">
              {batch.context_files.map((file: any, index: number) => (
                <Badge key={index} variant="secondary" className="mr-2">
                  {file.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
