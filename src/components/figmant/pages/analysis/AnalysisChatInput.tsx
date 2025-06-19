
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Link, Sparkles } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { SimpleTemplateSelector } from './SimpleTemplateSelector';

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
  onTemplateSelect: (templateId: string) => void;
  availableTemplates: any[];
  onViewTemplate: (template: any) => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  showUrlInput: boolean;
  urlInput: string;
  setUrlInput: (value: string) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('📝 ANALYSIS CHAT INPUT - Rendering with:', {
    messageLength: message.length,
    canSend,
    isAnalyzing,
    attachmentsCount: attachments.length,
    templatesCount: availableTemplates.length,
    selectedTemplate: selectedPromptTemplate?.title || 'None'
  });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="p-4 space-y-3">
      {/* Template Selector */}
      <div className="flex items-center justify-between">
        <SimpleTemplateSelector
          selectedTemplate={selectedPromptTemplate}
          onTemplateSelect={onTemplateSelect}
          availableTemplates={availableTemplates}
          onViewTemplate={onViewTemplate}
        />
      </div>

      {/* Attachments Display */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center gap-1 bg-background px-2 py-1 rounded text-sm">
              <span className="truncate max-w-32">{attachment.name}</span>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="text-muted-foreground hover:text-destructive"
                disabled={isAnalyzing}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* URL Input Section */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter website URL..."
            className="flex-1 px-3 py-2 border rounded-md"
            disabled={isAnalyzing}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onAddUrl();
              }
            }}
          />
          <Button onClick={onAddUrl} disabled={!urlInput.trim() || isAnalyzing}>
            Add
          </Button>
          <Button variant="outline" onClick={onCancelUrl} disabled={isAnalyzing}>
            Cancel
          </Button>
        </div>
      )}

      {/* Main Input Area */}
      <div className="flex gap-2">
        {/* Message Input */}
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Describe your design analysis needs..."
            className="min-h-[80px] resize-none"
            disabled={isAnalyzing}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFileClick}
            disabled={isAnalyzing}
            title="Upload files"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleUrlInput}
            disabled={isAnalyzing}
            title="Add website URL"
          >
            <Link className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            size="icon"
            title="Send message"
          >
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
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
