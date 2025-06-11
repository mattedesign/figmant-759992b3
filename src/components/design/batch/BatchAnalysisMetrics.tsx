
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Users } from 'lucide-react';

interface BatchAnalysisMetricsProps {
  batch: any;
  analysisCount: number;
  avgProcessingTime?: number;
}

export const BatchAnalysisMetrics = ({ batch, analysisCount, avgProcessingTime }: BatchAnalysisMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{analysisCount}</div>
              <div className="text-sm text-muted-foreground">Total Analyses</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{batch.use_case || 'General'}</div>
              <div className="text-sm text-muted-foreground">Use Case</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">
                {new Date(batch.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">Created</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">
                {avgProcessingTime ? `${Math.round(avgProcessingTime)}s` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
