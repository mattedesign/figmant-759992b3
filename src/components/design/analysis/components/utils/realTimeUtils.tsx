
import { Activity, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { ConnectionStatus, ConnectionQuality } from '../types/RealTimeEventsTypes';

export const getStatusIcon = (connectionStatus: ConnectionStatus) => {
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

export const getQualityBadgeVariant = (connectionQuality: ConnectionQuality) => {
  const variants = {
    excellent: 'default' as const,
    good: 'secondary' as const,
    poor: 'destructive' as const,
    unknown: 'outline' as const
  };
  
  return variants[connectionQuality];
};

export const getEventTypeIcon = (type: string) => {
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

export const formatUptime = (uptime: number) => {
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
