
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Link, Send, Loader2 } from 'lucide-react';

interface AnalysisChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  selectedPromptTemplate?: any;
  canSend: boolean;
  isAnalyzing?: boolean;
  onFileUpload: (files: FileList) => void;
  onToggleUrlInput: () => void;
}

export const AnalysisChatInput: React.FC<AnalysisChatInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  onKeyPress,
  selectedPromptTemplate,
  canSend,
  isAnalyzing = false,
  onFileUpload,
  onToggleUrlInput
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24; // Approximate line height
      const maxHeight = lineHeight * 4; // 4 lines max
      const minHeight = 48; // Increased minimum height for better button fit
      
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  // Reset height when message is cleared
  useEffect(() => {
    if (!message && textareaRef.current) {
      textareaRef.current.style.height = '48px'; // Reset to proper single line height
    }
  }, [message]);

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-3">
        {/* Selected template indicator */}
        {selectedPromptTemplate && (
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-md">
            Using template: <span className="font-medium">{selectedPromptTemplate.display_name || selectedPromptTemplate.title}</span>
          </div>
        )}
        
        {/* Input area */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Describe your design analysis needs..."
            className="min-h-[48px] max-h-[96px] resize-none pr-36 overflow-y-auto"
            style={{ height: '48px' }}
            disabled={isAnalyzing}
          />
          
          {/* Input controls - positioned inside the textarea with proper spacing */}
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center space-x-2">
            {/* File upload */}
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isAnalyzing}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-gray-100"
                disabled={isAnalyzing}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </label>
            
            {/* URL input toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleUrlInput}
              className="h-7 w-7 p-0 hover:bg-gray-100"
              disabled={isAnalyzing}
            >
              <Link className="h-4 w-4" />
            </Button>

            {/* Send button */}
            <Button
              onClick={onSendMessage}
              disabled={!canSend || isAnalyzing}
              size="sm"
              className="h-7 w-7 p-0"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
