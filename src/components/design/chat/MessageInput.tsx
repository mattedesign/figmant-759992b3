
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus } from 'lucide-react';

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  isLoading: boolean;
  hasContent: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  isLoading,
  hasContent
}) => {
  return (
    <div className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Ask me about your designs..."
        className="flex-1 min-h-[80px] resize-none"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
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
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSendMessage}
          disabled={!hasContent || isLoading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
