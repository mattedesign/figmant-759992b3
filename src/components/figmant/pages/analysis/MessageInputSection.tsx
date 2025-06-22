
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Link, Upload } from 'lucide-react';

interface MessageInputSectionProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onToggleUrlInput: () => void;
  isAnalyzing: boolean;
  canSend: boolean;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  onToggleUrlInput,
  isAnalyzing,
  canSend
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend && !isAnalyzing) {
        onSendMessage();
      }
    }
    onKeyPress?.(e);
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="space-y-3">
        {/* Message Input */}
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your design challenge or ask for analysis insights..."
            className="min-h-[80px] pr-12 resize-none"
            disabled={isAnalyzing}
          />
          
          {/* Send Button */}
          <Button
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            size="sm"
            className="absolute bottom-2 right-2 h-8 w-8 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleUrlInput}
              className="text-xs"
            >
              <Link className="h-3 w-3 mr-1" />
              Add URL
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload File
            </Button>
          </div>

          {/* Status */}
          <div className="text-xs text-gray-500">
            {isAnalyzing ? 'Analyzing...' : `${message.length} characters`}
          </div>
        </div>
      </div>
    </div>
  );
};
