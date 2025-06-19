
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, Upload, Link, Loader2, X, Globe, FileText } from 'lucide-react';
import { SimpleTemplateSelector } from './SimpleTemplateSelector';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

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
  attachments?: ChatAttachment[];
  onRemoveAttachment?: (attachmentId: string) => void;
  // URL input props
  showUrlInput?: boolean;
  urlInput?: string;
  setUrlInput?: (value: string) => void;
  onAddUrl?: () => void;
  onCancelUrl?: () => void;
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
  attachments = [],
  onRemoveAttachment,
  showUrlInput = false,
  urlInput = '',
  setUrlInput,
  onAddUrl,
  onCancelUrl
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    console.log('📁 FIGMANT CHAT - Upload button clicked');
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 FIGMANT CHAT - File input changed');
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('📁 FIGMANT CHAT - Files selected:', files.length);
      onFileUpload(files);
    }
    e.target.value = '';
  };

  const handleAddUrlClick = () => {
    console.log('🔗 FIGMANT CHAT - Add URL clicked, current urlInput:', urlInput);
    if (urlInput.trim() && onAddUrl) {
      onAddUrl();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend && !isAnalyzing) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="p-4 space-y-3 bg-transparent">
      <input 
        ref={fileInputRef} 
        type="file" 
        multiple 
        accept="image/*,.pdf" 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />

      {/* Template Selector */}
      <div className="flex items-center gap-2">
        <SimpleTemplateSelector 
          selectedTemplate={selectedPromptTemplate} 
          onTemplateSelect={onTemplateSelect} 
          availableTemplates={availableTemplates} 
          onViewTemplate={onViewTemplate} 
        />
      </div>

      {/* Attachments Display */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <Badge key={attachment.id} variant="secondary" className="flex items-center gap-1">
                {attachment.type === 'file' ? <FileText className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                <span className="truncate max-w-32">{attachment.name}</span>
                <span className="text-xs">({attachment.status})</span>
                {onRemoveAttachment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => onRemoveAttachment(attachment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* URL Input Section */}
      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-muted rounded-lg">
          <Input
            placeholder="Enter website URL (e.g., https://example.com)"
            value={urlInput}
            onChange={(e) => setUrlInput?.(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAddUrlClick}
            disabled={!urlInput.trim()}
            size="sm"
          >
            Add URL
          </Button>
          <Button 
            onClick={onCancelUrl}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="space-y-2">
        <Textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Describe what you'd like me to analyze..." 
          className="min-h-[100px] resize-none" 
          onKeyDown={handleKeyDown}
          disabled={isAnalyzing}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleUrlInput} 
              className="flex items-center gap-2"
              disabled={isAnalyzing}
            >
              <Link className="h-4 w-4" />
              Add URL
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUploadClick} 
              className="flex items-center gap-2"
              disabled={isAnalyzing}
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
          
          <Button 
            onClick={onSendMessage} 
            disabled={!canSend || isAnalyzing} 
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Analysis
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
