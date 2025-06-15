
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface RealtimeEvent {
  id: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  timestamp: Date;
  payload: any;
}

interface ConnectionMetrics {
  connectionAttempts: number;
  successfulConnections: number;
  failedConnections: number;
  averageReconnectTime: number;
  lastConnectionTime: Date | null;
  uptime: number;
}

interface RealTimeEventsMonitorProps {
  connectionStatus: 'connecting' | 'connected' | 'error' | 'fallback' | 'disabled';
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
  metrics: ConnectionMetrics;
  recentEvents: RealtimeEvent[];
  onClearEvents: () => void;
  onResetMetrics: () => void;
}

export const RealTimeEventsMonitor: React.FC<RealTimeEventsMonitorProps> = ({
  connectionStatus,
  connectionQuality,
  metrics,
  recentEvents,
  onClearEvents,
  onResetMetrics
}) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'fallback':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'disabled':
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getQualityBadge = () => {
    const variants = {
      excellent: 'default' as const,
      good: 'secondary' as const,
      poor: 'destructive' as const,
      unknown: 'outline' as const
    };
    
    return (
      <Badge variant={variants[connectionQuality]} className="text-xs">
        {connectionQuality}
      </Badge>
    );
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'INSERT':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'UPDATE':
        return <Activity className="h-3 w-3 text-blue-500" />;
      case 'DELETE':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const successRate = metrics.successfulConnections / (metrics.successfulConnections + metrics.failedConnections) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {getStatusIcon()}
              Real-time Connection
            </CardTitle>
            {getQualityBadge()}
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

      {/* Recent Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Events
              <Badge variant="outline" className="text-xs">
                {recentEvents.length}
              </Badge>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearEvents}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Live updates from the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            {recentEvents.length > 0 ? (
              <div className="space-y-2">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs">
                    {getEventTypeIcon(event.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.type}</span>
                        <span className="text-muted-foreground">{event.table}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {format(event.timestamp, 'HH:mm:ss')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-xs py-8">
                No recent events
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
