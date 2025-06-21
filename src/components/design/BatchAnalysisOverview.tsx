
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, History } from 'lucide-react';
import { DesignBatchAnalysis } from '@/types/design';
import { formatDistanceToNow } from 'date-fns';

interface BatchAnalysisOverviewProps {
  selectedVersion: DesignBatchAnalysis;
  batchUploadsLength: number;
  modificationHistoryLength: number;
}

export const BatchAnalysisOverview = ({
  selectedVersion,
  batchUploadsLength,
  modificationHistoryLength
}: BatchAnalysisOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Analysis of {batchUploadsLength} designs • {formatDistanceToNow(new Date(selectedVersion.created_at))} ago
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Designs Analyzed</p>
              <p className="text-2xl font-bold">{batchUploadsLength}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Confidence Score</p>
              <p className="text-2xl font-bold">{Math.round(selectedVersion.confidence_score * 100)}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <History className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Related Analyses</p>
              <p className="text-2xl font-bold">{modificationHistoryLength}</p>
            </div>
          </div>
        </div>

        {selectedVersion.context_summary && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm font-medium text-blue-800 mb-1">Context Enhanced Analysis</p>
            <p className="text-sm text-blue-700">{selectedVersion.context_summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
