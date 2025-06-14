
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useAuth } from '@/contexts/AuthContext';
import { getConnectionStatus } from '@/utils/claudeStatus';

interface ClaudeAIStatusIndicatorProps {
  compact?: boolean;
  onConfigureClick?: () => void;
}

export const ClaudeAIStatusIndicator = ({ 
  compact = false, 
  onConfigureClick 
}: ClaudeAIStatusIndicatorProps) => {
  const { data: claudeSettings, isLoading } = useClaudeSettings();
  const { isOwner } = useAuth();

  if (isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        Loading...
      </Badge>
    );
  }

  const connectionStatus = getConnectionStatus(
    claudeSettings?.claude_ai_enabled || false, 
    claudeSettings?.claude_api_key || ''
  );

  const StatusIcon = connectionStatus.icon;

  if (compact) {
    return (
      <Badge 
        variant={connectionStatus.status === 'ready' ? 'default' : 'secondary'}
        className="flex items-center space-x-1"
      >
        <StatusIcon className="h-3 w-3" />
        <span>{connectionStatus.text}</span>
      </Badge>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <StatusIcon className={`h-4 w-4 ${connectionStatus.color}`} />
        <span className="text-sm font-medium">Claude AI: {connectionStatus.text}</span>
      </div>
      
      {connectionStatus.status !== 'ready' && isOwner && onConfigureClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onConfigureClick}
          className="flex items-center space-x-1"
        >
          <Settings className="h-3 w-3" />
          <span>Configure</span>
        </Button>
      )}
    </div>
  );
};
