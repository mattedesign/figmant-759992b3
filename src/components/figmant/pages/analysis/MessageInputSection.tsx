
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Link, Upload } from 'lucide-react';

interface MessageInputSectionProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onToggleUrlInput: () => void;
  onFileUpload?: (files: FileList) => void;
  isAnalyzing: boolean;
  canSend: boolean;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  onToggleUrlInput,
  onFileUpload,
  isAnalyzing,
  canSend
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend && !isAnalyzing) {
        onSendMessage();
      }
    }
    onKeyPress?.(e);
  };

  const handleFileUploadClick = () => {
    console.log('📁 FILE UPLOAD BUTTON CLICKED');
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileUpload) {
      console.log('📁 FILES SELECTED:', files.length);
      onFileUpload(files);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleUrlButtonClick = () => {
    console.log('🔗 URL BUTTON CLICKED');
    onToggleUrlInput();
  };

  const handleSendButtonClick = () => {
    console.log('🚀 SEND BUTTON CLICKED');
    if (canSend && !isAnalyzing) {
      onSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

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
            onClick={handleSendButtonClick}
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
              onClick={handleUrlButtonClick}
              disabled={isAnalyzing}
              className="text-xs"
            >
              <Link className="h-3 w-3 mr-1" />
              Add URL
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFileUploadClick}
              disabled={isAnalyzing}
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
