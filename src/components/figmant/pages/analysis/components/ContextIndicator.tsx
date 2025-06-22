
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { History, MessageSquare, Paperclip, Clock } from 'lucide-react';
import { useEnhancedChatStateContext } from './EnhancedChatStateProvider';

export const ContextIndicator: React.FC = () => {
  const { conversationContext, isLoadingContext, currentSessionId } = useEnhancedChatStateContext();

  if (!currentSessionId) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-xs">
      {isLoadingContext ? (
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 animate-spin" />
          <span>Loading conversation context...</span>
        </div>
      ) : (
        <>
          {conversationContext.historicalContext && (
            <Badge variant="secondary" className="text-xs">
              <History className="h-3 w-3 mr-1" />
              History: {conversationContext.currentMessages.length} msgs
            </Badge>
          )}
          
          {conversationContext.attachmentContext && (
            <Badge variant="secondary" className="text-xs">
              <Paperclip className="h-3 w-3 mr-1" />
              Context Files Available
            </Badge>
          )}
          
          {conversationContext.tokenEstimate > 0 && (
            <Badge variant="outline" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              ~{conversationContext.tokenEstimate} tokens
            </Badge>
          )}
          
          {!conversationContext.historicalContext && !conversationContext.attachmentContext && (
            <Badge variant="outline" className="text-xs">
              New conversation
            </Badge>
          )}
        </>
      )}
    </div>
  );
};
