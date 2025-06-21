
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Link, X } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface ChatInputContainerProps {
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  onSendMessage: () => void;
  onFileUpload: (files: FileList) => void;
  onToggleUrlInput: () => void;
  onRemoveAttachment: (id: string) => void;
  isAnalyzing: boolean;
  showUrlInput: boolean;
}

export const ChatInputContainer: React.FC<ChatInputContainerProps> = ({
  message,
  setMessage,
  attachments,
  onSendMessage,
  onFileUpload,
  onToggleUrlInput,
  onRemoveAttachment,
  isAnalyzing,
  showUrlInput
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !isAnalyzing;

  return (
    <div className="border-t bg-white p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  {attachment.name}
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  attachment.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                  attachment.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {attachment.status}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveAttachment(attachment.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your design or ask for analysis..."
            className="resize-none"
            rows={3}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          {/* File Upload Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleFileButtonClick}
            disabled={isAnalyzing}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {/* URL Input Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={onToggleUrlInput}
            disabled={isAnalyzing}
            className={showUrlInput ? 'bg-blue-100' : ''}
          >
            <Link className="h-4 w-4" />
          </Button>
          
          {/* Send Button */}
          <Button
            onClick={onSendMessage}
            disabled={!canSend}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};
