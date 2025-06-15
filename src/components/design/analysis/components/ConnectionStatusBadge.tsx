
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Clock, RefreshCw } from 'lucide-react';

interface ConnectionStatusBadgeProps {
  status: 'connecting' | 'connected' | 'error' | 'fallback' | 'disabled';
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="h-3 w-3" />,
          text: 'Live',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'connecting':
        return {
          icon: <Clock className="h-3 w-3 animate-pulse" />,
          text: 'Connecting',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'fallback':
        return {
          icon: <RefreshCw className="h-3 w-3" />,
          text: 'Auto-refresh',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'disabled':
        return {
          icon: <WifiOff className="h-3 w-3" />,
          text: 'Disabled',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case 'error':
        return {
          icon: <WifiOff className="h-3 w-3" />,
          text: 'Error',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const { icon, text, className } = getStatusConfig();

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
      {icon}
      <span className="text-xs">{text}</span>
    </Badge>
  );
};
