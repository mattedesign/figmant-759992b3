
import React from 'react';
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

  return (
    <div className="border-t border-gray-200 p-6">
      <div className="flex flex-col space-y-3">
        {/* Selected template indicator */}
        {selectedPromptTemplate && (
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-md">
            Using template: <span className="font-medium">{selectedPromptTemplate.display_name || selectedPromptTemplate.title}</span>
          </div>
        )}
        
        {/* Input area */}
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your design analysis needs..."
              className="min-h-[80px] resize-none pr-24"
              disabled={isAnalyzing}
            />
            
            {/* Input controls */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-1">
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
                  className="h-8 w-8 p-0"
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
                className="h-8 w-8 p-0"
                disabled={isAnalyzing}
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Send button */}
          <Button
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            className="px-6"
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
  );
};
