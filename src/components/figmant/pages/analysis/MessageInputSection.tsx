
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Upload, Link, Loader2 } from 'lucide-react';

interface MessageInputSectionProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFileUpload: (files: FileList) => void;
  isAnalyzing: boolean;
  canSend: boolean;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  onKeyPress,
  onFileUpload,
  isAnalyzing,
  canSend
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Describe what you'd like me to analyze..."
            className="pr-32"
            onKeyDown={onKeyPress}
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
              onClick={handleUploadClick}
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
    </div>
  );
};
