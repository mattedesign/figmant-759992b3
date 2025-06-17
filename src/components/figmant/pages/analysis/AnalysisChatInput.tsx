
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
  onRemoveAttachment
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
    e.target.value = '';
  };

  return <div className="p-4 space-y-3 bg-transparent">
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} style={{
      display: 'none'
    }} />

      {/* Template Selector */}
      <div className="flex items-center gap-2">
        <SimpleTemplateSelector selectedTemplate={selectedPromptTemplate} onTemplateSelect={onTemplateSelect} availableTemplates={availableTemplates} onViewTemplate={onViewTemplate} />
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe what you'd like me to analyze..." className="min-h-[100px] resize-none" onKeyDown={onKeyPress} />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggleUrlInput} className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Add URL
            </Button>
            <Button variant="outline" size="sm" onClick={handleUploadClick} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
          
          <Button onClick={onSendMessage} disabled={!canSend || isAnalyzing} className="flex items-center gap-2">
            {isAnalyzing ? <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </> : <>
                <Send className="h-4 w-4" />
                Send Analysis
              </>}
          </Button>
        </div>
      </div>
    </div>;
};
