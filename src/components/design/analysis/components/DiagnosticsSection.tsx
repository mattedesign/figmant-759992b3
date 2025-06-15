
import React from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ConnectionDiagnostics } from '../ConnectionDiagnostics';

interface DiagnosticsSectionProps {
  showDiagnostics: boolean;
  connectionStatus: 'connecting' | 'connected' | 'error' | 'fallback' | 'disabled';
  isRealTimeEnabled: boolean;
  onToggleRealTime: () => void;
  onRetryConnection: () => void;
}

export const DiagnosticsSection: React.FC<DiagnosticsSectionProps> = ({
  showDiagnostics,
  connectionStatus,
  isRealTimeEnabled,
  onToggleRealTime,
  onRetryConnection
}) => {
  return (
    <Collapsible open={showDiagnostics}>
      <CollapsibleContent>
        <ConnectionDiagnostics
          connectionStatus={connectionStatus}
          isEnabled={isRealTimeEnabled}
          onToggleConnection={onToggleRealTime}
          onRetryConnection={onRetryConnection}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
