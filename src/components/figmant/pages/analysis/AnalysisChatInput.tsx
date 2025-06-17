
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Link, Send, Sparkles } from 'lucide-react';

interface AnalysisChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedPromptTemplate?: any;
  canSend: boolean;
  isAnalyzing: boolean;
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
  isAnalyzing,
  onFileUpload,
  onToggleUrlInput
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onFileUpload(files);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="p-6 bg-white border-t border-gray-100">
      {/* Selected Template Badge */}
      {selectedPromptTemplate && (
        <div className="mb-3">
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Sparkles className="h-3 w-3" />
            {selectedPromptTemplate.display_name}
          </Badge>
        </div>
      )}
      
      {/* Input Area */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Describe what you'd like me to analyze..."
            className="min-h-[100px] resize-none text-left"
            style={{ textAlign: 'left' }}
            disabled={isAnalyzing}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          {/* File Upload Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleFileClick}
            title="Upload files"
            disabled={isAnalyzing}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {/* URL Input Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleUrlInput}
            title="Add website URL"
            disabled={isAnalyzing}
          >
            <Link className="h-4 w-4" />
          </Button>
          
          {/* Send Button */}
          <Button
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
