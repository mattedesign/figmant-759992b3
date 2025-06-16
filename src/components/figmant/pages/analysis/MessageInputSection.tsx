
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Upload, Link, Loader2 } from 'lucide-react';

interface MessageInputSectionProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isAnalyzing: boolean;
  canSend: boolean;
  isDragActive: boolean;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  onKeyPress,
  isAnalyzing,
  canSend,
  isDragActive,
  getRootProps,
  getInputProps
}) => {
  return (
    <div {...getRootProps()} className={`p-4 border-t border-gray-200 ${isDragActive ? 'bg-blue-50 border-blue-300' : ''}`}>
      <input {...getInputProps()} />
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Describe what you'd like me to analyze..."
            className="pr-32"
            onKeyPress={onKeyPress}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={onToggleUrlInput}
              title="Add website URL"
            >
              <Link className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              title="Upload files"
            >
              <Upload className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={onSendMessage}
              disabled={!canSend}
            >
              {isAnalyzing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Mic className="h-4 w-4" />
        </Button>
      </div>
      
      {isDragActive && (
        <div className="mt-2 text-center text-sm text-blue-600">
          Drop files here to analyze...
        </div>
      )}
    </div>
  );
};
