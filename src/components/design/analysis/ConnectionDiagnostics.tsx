
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Wifi, WifiOff, RefreshCw, Settings, Clock, CheckCircle } from 'lucide-react';

interface ConnectionDiagnosticsProps {
  connectionStatus: 'connecting' | 'connected' | 'error' | 'fallback' | 'disabled';
  isEnabled: boolean;
  onToggleConnection: () => void;
  onRetryConnection: () => void;
}

export const ConnectionDiagnostics: React.FC<ConnectionDiagnosticsProps> = ({
  connectionStatus,
  isEnabled,
  onToggleConnection,
  onRetryConnection
}) => {
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: 'Live Updates Active',
          description: 'Real-time updates are working properly',
          badgeClass: 'bg-green-100 text-green-800 border-green-200',
          cardClass: 'border-green-200'
        };
      case 'connecting':
        return {
          icon: <Clock className="h-4 w-4 animate-pulse" />,
          text: 'Connecting...',
          description: 'Establishing real-time connection',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          cardClass: 'border-blue-200'
        };
      case 'fallback':
        return {
          icon: <RefreshCw className="h-4 w-4" />,
          text: 'Auto-refresh Mode',
          description: 'Using automatic refresh every 30 seconds',
          badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          cardClass: 'border-yellow-200'
        };
      case 'disabled':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Real-time Disabled',
          description: 'Real-time updates are manually disabled',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
          cardClass: 'border-gray-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Connection Failed',
          description: 'Real-time connection failed, using fallback mode',
          badgeClass: 'bg-red-100 text-red-800 border-red-200',
          cardClass: 'border-red-200'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          text: 'Unknown',
          description: 'Connection status unknown',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
          cardClass: 'border-gray-200'
        };
    }
  };

  const { icon, text, description, badgeClass, cardClass } = getStatusConfig();

  return (
    <Card className={`${cardClass}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Connection Status
          </span>
          <Badge variant="outline" className={`flex items-center gap-1 ${badgeClass}`}>
            {icon}
            <span className="text-xs">{text}</span>
          </Badge>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          {connectionStatus === 'error' && (
            <Button onClick={onRetryConnection} size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Connection
            </Button>
          )}
          
          <Button 
            onClick={onToggleConnection} 
            size="sm" 
            variant={isEnabled ? "outline" : "default"}
          >
            {isEnabled ? (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Disable Real-time
              </>
            ) : (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Enable Real-time
              </>
            )}
          </Button>
        </div>

        {connectionStatus === 'fallback' && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <CheckCircle className="h-3 w-3 inline mr-1" />
            Data will refresh automatically every 30 seconds
          </div>
        )}

        {connectionStatus === 'disabled' && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            Manual refresh required to see new data
          </div>
        )}
      </CardContent>
    </Card>
  );
};
