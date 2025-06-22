
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Paperclip } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ContextIndicatorProps {
  hasHistoricalContext: boolean;
  hasAttachmentContext: boolean;
  messageCount?: number;
  tokenEstimate?: number;
  className?: string;
}

export const ContextIndicator: React.FC<ContextIndicatorProps> = ({
  hasHistoricalContext,
  hasAttachmentContext,
  messageCount = 0,
  tokenEstimate = 0,
  className = ""
}) => {
  if (!hasHistoricalContext && !hasAttachmentContext) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {hasHistoricalContext && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Brain className="h-3 w-3" />
                Context
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <div>Historical context available</div>
                {messageCount > 0 && <div>{messageCount} previous messages</div>}
                {tokenEstimate > 0 && <div>~{tokenEstimate} tokens</div>}
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {hasAttachmentContext && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Paperclip className="h-3 w-3" />
                Files
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous attachments referenced</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="default" className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3 w-3" />
              Enhanced
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enhanced analysis with conversation context</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
