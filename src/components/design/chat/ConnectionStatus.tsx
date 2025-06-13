
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  isConnected?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected = true,
  isLoading = false,
  onRetry
}) => {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (!isConnected || isLoading) {
      setShowStatus(true);
    } else {
      // Hide status after a delay when connected
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, isLoading]);

  if (!showStatus && isConnected && !isLoading) {
    return null;
  }

  const getStatusContent = () => {
    if (isLoading) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Connecting...
        </Badge>
      );
    }

    if (!isConnected) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <WifiOff className="h-3 w-3" />
            Disconnected
          </Badge>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      );
    }

    return (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Connected
      </Badge>
    );
  };

  return (
    <div className="flex justify-center py-2">
      {getStatusContent()}
    </div>
  );
};
