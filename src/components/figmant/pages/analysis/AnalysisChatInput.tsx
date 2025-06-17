
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Link, Send, Sparkles, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  onTemplateSelect?: (templateId: string) => void;
  availableTemplates?: any[];
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
  onToggleUrlInput,
  onTemplateSelect,
  availableTemplates = []
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

  const handleTemplateSelect = (templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  };

  return (
    <div className="p-6 bg-white border-t border-gray-100">
      {/* Template Dropdown Selector */}
      {selectedPromptTemplate && (
        <div className="mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-2 flex items-center gap-2 hover:bg-gray-50 border border-gray-200 rounded-lg"
                disabled={isAnalyzing}
              >
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-gray-900">{selectedPromptTemplate.display_name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-white z-50">
              {availableTemplates.map((template) => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`cursor-pointer p-3 ${
                    template.id === selectedPromptTemplate.id 
                      ? 'bg-blue-50 border-l-2 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                      <span className="font-medium">{template.display_name}</span>
                      {template.id === selectedPromptTemplate.id && (
                        <Badge variant="default" className="ml-auto text-xs">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-left">{template.description}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
