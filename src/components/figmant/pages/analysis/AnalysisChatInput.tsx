
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Link, Mic } from 'lucide-react';

interface AnalysisChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  selectedPromptTemplate?: any;
  canSend: boolean;
  onFileUpload?: (files: FileList) => void;
  onToggleUrlInput?: () => void;
}

export const AnalysisChatInput: React.FC<AnalysisChatInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  selectedPromptTemplate,
  canSend,
  onFileUpload,
  onToggleUrlInput
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && canSend) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div 
        className="relative flex items-start gap-2 p-3"
        style={{
          minHeight: '120px',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          background: '#FAFAFA'
        }}
      >
        {/* Left side buttons */}
        <div className="flex gap-1 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleFileSelect}
            title="Upload files"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleUrlInput}
            title="Add website URL"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Voice input"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        {/* Text area */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedPromptTemplate ? `Using template: ${selectedPromptTemplate.name}` : "Describe what you'd like to analyze..."}
          className="flex-1 resize-none border-0 bg-transparent placeholder:text-gray-500 focus:ring-0 p-0 min-h-[80px]"
          onKeyDown={handleKeyPress}
        />

        {/* Send button */}
        <div className="pt-1">
          <Button
            onClick={onSendMessage}
            disabled={!canSend}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
