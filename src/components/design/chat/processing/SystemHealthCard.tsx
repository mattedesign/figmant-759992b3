
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';

interface SystemHealthCardProps {
  systemHealth: {
    memoryUsage: number;
    processingQueue: number;
    averageProcessingTime: number;
  };
  formatTime: (seconds: number) => string;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  systemHealth,
  formatTime
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Memory Usage</p>
            <div className="flex items-center gap-2">
              <Progress value={systemHealth.memoryUsage} className="flex-1 h-2" />
              <span className="text-xs font-mono">{systemHealth.memoryUsage}%</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Queue Length</p>
            <p className="font-semibold">{systemHealth.processingQueue} items</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Processing Time</p>
            <p className="font-semibold">{formatTime(systemHealth.averageProcessingTime)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
