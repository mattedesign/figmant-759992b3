
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, GitBranch, Eye, FileText } from 'lucide-react';
import { DesignBatchAnalysis } from '@/types/design';
import { formatDistanceToNow } from 'date-fns';

interface BatchVersionHistoryProps {
  versions: DesignBatchAnalysis[];
  onViewVersion: (version: DesignBatchAnalysis) => void;
  currentVersionId?: string;
}

export const BatchVersionHistory = ({ 
  versions, 
  onViewVersion, 
  currentVersionId 
}: BatchVersionHistoryProps) => {
  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <GitBranch className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No version history available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Analysis Version History</h3>
        <Badge variant="outline">{versions.length} versions</Badge>
      </div>

      {versions.map((version, index) => {
        const isLatest = index === 0;
        const isCurrent = version.id === currentVersionId;
        
        return (
          <Card 
            key={version.id} 
            className={`${isCurrent ? 'ring-2 ring-primary' : ''} ${isLatest ? 'border-green-200 bg-green-50/50' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    Version {version.version_number}
                    {isLatest && <Badge className="bg-green-600">Latest</Badge>}
                    {isCurrent && <Badge variant="outline">Current</Badge>}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(version.created_at))} ago
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewVersion(version)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {version.modification_summary && (
                <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Modifications:</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {version.modification_summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Analysis Type</p>
                  <p className="capitalize">{version.analysis_type}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Confidence</p>
                  <p>{Math.round(version.confidence_score * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
