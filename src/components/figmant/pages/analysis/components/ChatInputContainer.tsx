
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, Upload, Link, Zap } from 'lucide-react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface ChatInputContainerProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedPromptTemplate: FigmantPromptTemplate | null;
  canSend: boolean;
  isAnalyzing: boolean;
  onFileUpload: (files: FileList) => void;
  onToggleUrlInput: () => void;
  onTemplateSelect: (templateId: string) => void;
  availableTemplates: FigmantPromptTemplate[];
  onViewTemplate: (template: FigmantPromptTemplate) => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  showUrlInput: boolean;
  urlInput: string;
  setUrlInput: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
}

export const ChatInputContainer: React.FC<ChatInputContainerProps> = ({
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
  availableTemplates,
  attachments,
  onRemoveAttachment
}) => {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 text-sm">
              <span className="truncate max-w-[120px]">{attachment.name}</span>
              <button onClick={() => onRemoveAttachment(attachment.id)} className="text-gray-500 hover:text-red-500">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Template indicator */}
      {selectedPromptTemplate && (
        <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
          <Zap className="w-4 h-4" />
          <span>Using template: {selectedPromptTemplate.title}</span>
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message..."
            className="min-h-[44px] max-h-[120px] resize-none"
            disabled={isAnalyzing}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col gap-1">
          <input
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            id="file-input"
            accept="image/*,.pdf,.txt,.md"
          />
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={isAnalyzing}
            className="h-9 w-9"
          >
            <Upload className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleUrlInput}
            disabled={isAnalyzing}
            className="h-9 w-9"
          >
            <Link className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            size="icon"
            className="h-9 w-9"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
