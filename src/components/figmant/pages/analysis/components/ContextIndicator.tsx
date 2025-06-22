
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Save } from 'lucide-react';

interface ContextIndicatorProps {
  hasHistoricalContext: boolean;
  hasAttachmentContext: boolean;
  messageCount: number;
  tokenEstimate: number;
  autoSaveStatus: 'saving' | 'saved' | 'error' | 'idle';
  lastSaved?: Date;
}

export const ContextIndicator: React.FC<ContextIndicatorProps> = ({
  hasHistoricalContext,
  hasAttachmentContext,
  messageCount,
  tokenEstimate,
  autoSaveStatus,
  lastSaved
}) => {
  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Save className="h-3 w-3 animate-pulse" />
            Saving...
          </Badge>
        );
      case 'saved':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3" />
            Saved
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Save Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Messages: {messageCount}</span>
        
        {hasHistoricalContext && (
          <Badge variant="outline" className="text-xs">
            Enhanced Context
          </Badge>
        )}
        
        {hasAttachmentContext && (
          <Badge variant="outline" className="text-xs">
            Attachments
          </Badge>
        )}
      </div>
      
      {getAutoSaveIndicator()}
      
      {lastSaved && autoSaveStatus === 'saved' && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
