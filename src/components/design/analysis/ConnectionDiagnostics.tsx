
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Wifi, WifiOff, RefreshCw, Settings, Clock, CheckCircle, Info } from 'lucide-react';

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
          description: 'Real-time updates are working properly. New data will appear automatically.',
          badgeClass: 'bg-green-100 text-green-800 border-green-200',
          cardClass: 'border-green-200'
        };
      case 'connecting':
        return {
          icon: <Clock className="h-4 w-4 animate-pulse" />,
          text: 'Connecting...',
          description: 'Attempting to establish real-time connection. Will fallback to auto-refresh if needed.',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          cardClass: 'border-blue-200'
        };
      case 'fallback':
        return {
          icon: <RefreshCw className="h-4 w-4" />,
          text: 'Auto-refresh Active',
          description: 'Real-time connection unavailable, but data refreshes automatically every 30 seconds. All features work normally.',
          badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          cardClass: 'border-yellow-200'
        };
      case 'disabled':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Real-time Disabled',
          description: 'Real-time updates are manually disabled. Use manual refresh to see new data.',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
          cardClass: 'border-gray-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Connection Issue',
          description: 'Real-time connection encountered issues. Auto-refresh is active as backup.',
          badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
          cardClass: 'border-orange-200'
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
          {(connectionStatus === 'error' || connectionStatus === 'fallback') && (
            <Button onClick={onRetryConnection} size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Real-time
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
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              App is fully functional! Data refreshes automatically every 30 seconds. 
              Real-time updates will be restored when connection improves.
            </span>
          </div>
        )}

        {connectionStatus === 'disabled' && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              Real-time updates are disabled. Use the manual refresh button to see new data.
            </span>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="text-xs text-muted-foreground p-2 bg-green-50 rounded flex items-start gap-2">
            <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
            <span className="text-green-700">
              Real-time connection is active. New analyses will appear automatically.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
