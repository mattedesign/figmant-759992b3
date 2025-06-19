
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Globe, X, FileText, Image } from 'lucide-react';
import { FigmantPromptTemplate } from '@/types/figmant';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { PromptTemplateSelector } from './PromptTemplateSelector';
import { URLAttachmentHandler } from './components/URLAttachmentHandler';

interface AnalysisChatInputProps {
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
  availableTemplates,
  onViewTemplate,
  attachments,
  onRemoveAttachment,
  showUrlInput,
  urlInput,
  setUrlInput,
  onAddUrl,
  onCancelUrl
}) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="p-4 border-t bg-background space-y-4">
      {/* Template Selector */}
      <PromptTemplateSelector
        templates={availableTemplates}
        selectedTemplate={selectedPromptTemplate}
        onTemplateSelect={onTemplateSelect}
        onViewTemplate={onViewTemplate}
      />

      {/* URL Input Section */}
      <URLAttachmentHandler
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        setShowUrlInput={(show) => show ? onToggleUrlInput() : onCancelUrl()}
        attachments={attachments}
        setAttachments={(newAttachments) => {
          // This is handled by the parent component through state management
          // The URLAttachmentHandler will update attachments directly
        }}
      >
        {(handleAddUrl) => showUrlInput && (
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Add Website URL</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelUrl}
                className="ml-auto h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </URLAttachmentHandler>

      {/* Attachments Display */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <Badge
              key={attachment.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {attachment.type === 'file' ? (
                attachment.file?.type.startsWith('image/') ? <Image className="w-3 h-3" /> : <FileText className="w-3 h-3" />
              ) : (
                <Globe className="w-3 h-3" />
              )}
              <span className="text-xs">{attachment.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(attachment.id)}
                className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Message Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={selectedPromptTemplate 
              ? `Ask about your design using ${selectedPromptTemplate.display_name || selectedPromptTemplate.title}...`
              : "Ask me anything about your design..."
            }
            className="min-h-[80px] resize-none pr-20"
            disabled={isAnalyzing}
          />
          
          {/* Attachment Buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,.pdf,.sketch,.fig,.xd"
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="h-6 w-6 p-0"
              disabled={isAnalyzing}
            >
              <Paperclip className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleUrlInput}
              className="h-6 w-6 p-0"
              disabled={isAnalyzing}
            >
              <Globe className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={onSendMessage}
          disabled={!canSend}
          className="self-end"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
