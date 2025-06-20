
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Plus, Globe, Upload, X } from 'lucide-react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { URLInputHandler } from './URLInputHandler';
import { AttachmentPreviewList } from './AttachmentPreviewList';

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
  selectedPromptTemplate,
  canSend,
  isAnalyzing,
  onFileUpload,
  onToggleUrlInput,
  attachments,
  onRemoveAttachment,
  showUrlInput,
  urlInput,
  setUrlInput,
  onAddUrl,
  onCancelUrl
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFileUpload(files);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canSend && !isAnalyzing) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleAttachmentAdd = (attachment: ChatAttachment) => {
    // This will be handled by the parent component's state
    console.log('Adding attachment:', attachment);
  };

  const handleAttachmentUpdate = (id: string, updates: Partial<ChatAttachment>) => {
    // This will be handled by the parent component's state
    console.log('Updating attachment:', id, updates);
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* URL Input Handler */}
      <URLInputHandler
        showUrlInput={showUrlInput}
        onClose={onCancelUrl}
        attachments={attachments}
        onAttachmentAdd={handleAttachmentAdd}
        onAttachmentUpdate={handleAttachmentUpdate}
      />

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <AttachmentPreviewList
            attachments={attachments}
            onRemoveAttachment={onRemoveAttachment}
          />
        </div>
      )}

      {/* Main Input Area */}
      <div className="p-4">
        <div className="flex items-end gap-3">
          {/* Attachment Menu */}
          <div className="flex gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              disabled={isAnalyzing}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              File
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleUrlInput}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              URL
            </Button>
          </div>

          {/* Text Input */}
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedPromptTemplate
                  ? `Ask for ${selectedPromptTemplate.displayName.toLowerCase()}...`
                  : "Describe your design and ask for analysis..."
              }
              className="min-h-[60px] resize-none"
              onKeyDown={handleKeyPress}
              disabled={isAnalyzing}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            size="sm"
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Context Info */}
        {selectedPromptTemplate && (
          <div className="mt-2 text-xs text-muted-foreground">
            Using template: <span className="font-medium">{selectedPromptTemplate.displayName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
