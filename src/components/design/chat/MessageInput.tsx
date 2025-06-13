
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, Loader2 } from 'lucide-react';

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  isLoading: boolean;
  hasContent: boolean;
  canSend?: boolean;
  loadingStage?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  isLoading,
  hasContent,
  canSend = true,
  loadingStage
}) => {
  const isDisabled = !hasContent || isLoading || !canSend;

  const getSendButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-1 text-xs">
            {loadingStage || 'Sending...'}
          </span>
        </>
      );
    }
    return <Send className="h-4 w-4" />;
  };

  const getSendButtonTitle = () => {
    if (isLoading) {
      return `Processing: ${loadingStage || 'Sending message...'}`;
    }
    if (!canSend) {
      return "Please wait for uploads to complete";
    }
    return "Send message";
  };

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
          title={getSendButtonTitle()}
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
