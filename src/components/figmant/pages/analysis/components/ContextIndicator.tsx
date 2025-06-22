
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { 
  MessageSquare, 
  FileText, 
  Brain, 
  Zap 
} from 'lucide-react';

interface ContextIndicatorProps {
  hasHistoricalContext: boolean;
  hasAttachmentContext: boolean;
  messageCount: number;
  tokenEstimate: number;
  autoSaveStatus?: 'saving' | 'saved' | 'error' | 'idle';
  lastSaved?: Date;
  className?: string;
}

export const ContextIndicator: React.FC<ContextIndicatorProps> = ({
  hasHistoricalContext,
  hasAttachmentContext,
  messageCount,
  tokenEstimate,
  autoSaveStatus = 'idle',
  lastSaved,
  className = ""
}) => {
  const getContextLevel = () => {
    if (hasHistoricalContext && hasAttachmentContext) return 'premium';
    if (hasHistoricalContext || hasAttachmentContext) return 'enhanced';
    return 'basic';
  };

  const contextLevel = getContextLevel();

  const getContextDescription = () => {
    switch (contextLevel) {
      case 'premium':
        return 'Premium context with full conversation history and attachments';
      case 'enhanced':
        return hasHistoricalContext 
          ? 'Enhanced context with conversation history'
          : 'Enhanced context with attached materials';
      default:
        return 'Basic context - start chatting to build conversation memory';
    }
  };

  const getContextBadgeVariant = () => {
    switch (contextLevel) {
      case 'premium':
        return 'default'; // Blue
      case 'enhanced':
        return 'secondary'; // Gray
      default:
        return 'outline'; // White with border
    }
  };

  const getContextIcon = () => {
    switch (contextLevel) {
      case 'premium':
        return <Zap className="h-3 w-3" />;
      case 'enhanced':
        return <Brain className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Context Level Indicator */}
      <Badge 
        variant={getContextBadgeVariant()}
        className="flex items-center gap-1 text-xs"
        title={getContextDescription()}
      >
        {getContextIcon()}
        <span className="capitalize">{contextLevel} Context</span>
      </Badge>
      
      {/* Message Count */}
      <Badge variant="outline" className="flex items-center gap-1 text-xs">
        <MessageSquare className="h-3 w-3" />
        {messageCount} messages
      </Badge>

      {/* Attachment Indicator */}
      {hasAttachmentContext && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <FileText className="h-3 w-3" />
          Files attached
        </Badge>
      )}

      {/* Token Usage (for premium context) */}
      {tokenEstimate > 0 && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 text-xs ${
            tokenEstimate > 8000 ? 'bg-yellow-50 text-yellow-700' : ''
          }`}
          title={`Context size: ${tokenEstimate} tokens`}
        >
          <Brain className="h-3 w-3" />
          {Math.ceil(tokenEstimate / 100)}% context
        </Badge>
      )}

      {/* Auto-save Status */}
      <div className="ml-auto">
        <AutoSaveIndicator
          status={autoSaveStatus}
          lastSaved={lastSaved}
          messageCount={messageCount}
        />
      </div>
    </div>
  );
};
