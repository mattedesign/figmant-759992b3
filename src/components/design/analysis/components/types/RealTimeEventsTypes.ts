
export interface RealtimeEvent {
  id: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  timestamp: Date;
  payload: any;
}

export interface ConnectionMetrics {
  connectionAttempts: number;
  successfulConnections: number;
  failedConnections: number;
  averageReconnectTime: number;
  lastConnectionTime: Date | null;
  uptime: number;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'error' | 'fallback' | 'disabled';
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'unknown';
