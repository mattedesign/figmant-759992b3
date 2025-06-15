
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Paperclip, Upload, Link } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  isLoading: boolean;
  hasContent: boolean;
  canSend?: boolean;
  loadingStage?: string;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  isLoading,
  hasContent,
  canSend = true,
  loadingStage,
  getRootProps,
  getInputProps,
  isDragActive,
}) => {
  const isDisabled = !hasContent || isLoading || !canSend;
  const inputProps = getInputProps();

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
    <div
      {...getRootProps()}
      className={`relative border rounded-lg transition-colors bg-background ${
        isDragActive
          ? 'border-primary ring-2 ring-primary ring-offset-2'
          : 'border-input'
      } ${isLoading ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start p-2 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Attach file or link"
              disabled={isLoading}
              className="flex-shrink-0 h-9 w-9 mt-0.5"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-1 mb-2">
            <div className="grid gap-1">
              <Button variant="ghost" className="w-full justify-start h-9" asChild>
                <label className="cursor-pointer flex items-center w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                  <input {...inputProps} className="sr-only" />
                </label>
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9" onClick={onToggleUrlInput}>
                <Link className="mr-2 h-4 w-4" />
                Add URL
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={isDragActive ? "Drop files to attach" : "Ask about your designs, or paste an image..."}
          className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 p-0 m-0 min-h-[40px] max-h-48 bg-transparent"
          style={{lineHeight: '1.5rem', paddingTop: '0.375rem', paddingBottom: '0.375rem'}}
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
              e.preventDefault();
              onSendMessage();
            }
          }}
        />
        <div className="flex items-end">
          <Button
            onClick={onSendMessage}
            disabled={isDisabled}
            size={isLoading ? "default" : "icon"}
            title={getSendButtonTitle()}
            className={`transition-all duration-200 flex-shrink-0 h-9 ${
              isLoading ? 'w-auto px-3' : 'w-9'
            }`}
          >
            {getSendButtonContent()}
          </Button>
        </div>
      </div>
    </div>
  );
};
