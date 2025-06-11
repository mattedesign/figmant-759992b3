
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, BarChart3 } from 'lucide-react';

interface BatchAnalysisResultsProps {
  results: any[];
  onViewAnalysis: (analysisId: string) => void;
  onViewDashboard: (batchId: string) => void;
  batchId: string;
}

export const BatchAnalysisResults = ({ results, onViewAnalysis, onViewDashboard, batchId }: BatchAnalysisResultsProps) => {
  const successfulAnalyses = results.filter(result => result.status === 'completed');
  const failedAnalyses = results.filter(result => result.status === 'failed');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Analysis Results</CardTitle>
          <Button
            onClick={() => onViewDashboard(batchId)}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>View Dashboard</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Successful: {successfulAnalyses.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="font-medium">Failed: {failedAnalyses.length}</span>
          </div>
        </div>

        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {result.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <div className="font-medium">{result.design_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.status === 'completed' 
                      ? `Completed at ${new Date(result.created_at).toLocaleString()}`
                      : `Failed: ${result.error_message}`
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={result.status === 'completed' ? 'default' : 'destructive'}>
                  {result.status}
                </Badge>
                {result.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewAnalysis(result.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
