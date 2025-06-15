
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ConnectionMetrics, ConnectionStatus, ConnectionQuality } from './types/RealTimeEventsTypes';
import { getStatusIcon, getQualityBadgeVariant, formatUptime } from './utils/realTimeUtils';

interface ConnectionStatusCardProps {
  connectionStatus: ConnectionStatus;
  connectionQuality: ConnectionQuality;
  metrics: ConnectionMetrics;
  onResetMetrics: () => void;
}

export const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({
  connectionStatus,
  connectionQuality,
  metrics,
  onResetMetrics
}) => {
  const successRate = metrics.successfulConnections / (metrics.successfulConnections + metrics.failedConnections) || 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {getStatusIcon(connectionStatus)}
            Real-time Connection
          </CardTitle>
          <Badge variant={getQualityBadgeVariant(connectionQuality)} className="text-xs">
            {connectionQuality}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Connection status and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-muted-foreground">Status</div>
            <div className="font-medium capitalize">{connectionStatus}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Uptime</div>
            <div className="font-medium">{formatUptime(metrics.uptime)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Success Rate</div>
            <div className="font-medium">{(successRate * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg Reconnect</div>
            <div className="font-medium">{metrics.averageReconnectTime.toFixed(0)}ms</div>
          </div>
          <div>
            <div className="text-muted-foreground">Attempts</div>
            <div className="font-medium">{metrics.connectionAttempts}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Last Connected</div>
            <div className="font-medium">
              {metrics.lastConnectionTime 
                ? format(metrics.lastConnectionTime, 'HH:mm:ss')
                : 'Never'
              }
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetMetrics}
          className="w-full text-xs"
        >
          Reset Metrics
        </Button>
      </CardContent>
    </Card>
  );
};
