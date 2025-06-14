
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, Loader2, Paperclip } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileMessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  isLoading: boolean;
  hasContent: boolean;
  canSend?: boolean;
  loadingStage?: string;
}

export const MobileMessageInput: React.FC<MobileMessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  isLoading,
  hasContent,
  canSend = true,
  loadingStage
}) => {
  const isMobile = useIsMobile();
  const isDisabled = !hasContent || isLoading || !canSend;

  const getSendButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!isMobile && (
            <span className="ml-1 text-xs">
              {loadingStage || 'Sending...'}
            </span>
          )}
        </>
      );
    }
    return <Send className="h-4 w-4" />;
  };

  if (isMobile) {
    return (
      <div className="bg-background border-t p-4 space-y-3">
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={isLoading ? "Processing your message..." : "Ask me about your designs..."}
          className="min-h-[60px] resize-none text-base"
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
              e.preventDefault();
              onSendMessage();
            }
          }}
        />
        
        <div className="flex gap-3">
          <Button
            onClick={onToggleUrlInput}
            variant="outline"
            size="lg"
            className="flex-1 h-12"
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Add URL
          </Button>
          
          <Button
            onClick={onSendMessage}
            disabled={isDisabled}
            size="lg"
            className="h-12 min-w-[80px]"
          >
            {getSendButtonContent()}
          </Button>
        </div>
        
        {isLoading && loadingStage && (
          <div className="text-center text-sm text-muted-foreground">
            {loadingStage}
          </div>
        )}
      </div>
    );
  }

  // Desktop layout - use existing MessageInput logic
  return (
    <div className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder={isLoading ? "Processing your message..." : "Ask me about your designs..."}
        className={`flex-1 min-h-[80px] resize-none transition-all duration-200 ${
          isLoading ? 'opacity-60' : ''
        }`}
        disabled={isLoading}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
            e.preventDefault();
            onSendMessage();
          }
        }}
      />
      <div className="flex flex-col gap-2">
        <Button
          onClick={onToggleUrlInput}
          variant="outline"
          size="icon"
          title="Add website URL"
          disabled={isLoading}
          className={`transition-all duration-200 ${isLoading ? 'opacity-50' : ''}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSendMessage}
          disabled={isDisabled}
          size={isLoading ? "default" : "icon"}
          title={canSend ? "Send message" : "Please wait for uploads to complete"}
          className={`transition-all duration-200 ${
            isLoading ? 'w-auto px-3' : 'w-10'
          }`}
        >
          {getSendButtonContent()}
        </Button>
      </div>
    </div>
  );
};
