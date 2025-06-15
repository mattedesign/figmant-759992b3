
import React from 'react';
import { ConnectionStatusCard } from './ConnectionStatusCard';
import { RecentEventsCard } from './RecentEventsCard';
import { ConnectionMetrics, RealtimeEvent, ConnectionStatus, ConnectionQuality } from './types/RealTimeEventsTypes';

interface RealTimeEventsMonitorProps {
  connectionStatus: ConnectionStatus;
  connectionQuality: ConnectionQuality;
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ConnectionStatusCard
        connectionStatus={connectionStatus}
        connectionQuality={connectionQuality}
        metrics={metrics}
        onResetMetrics={onResetMetrics}
      />
      
      <RecentEventsCard
        recentEvents={recentEvents}
        onClearEvents={onClearEvents}
      />
    </div>
  );
};
