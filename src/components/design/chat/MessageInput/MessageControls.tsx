
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2, Mic } from 'lucide-react';
import { AttachmentButton } from './AttachmentButton';
import { TemplateSelector } from './TemplateSelector';
import { ModelSelector } from './ModelSelector';

interface MessageControlsProps {
  selectedTemplate: string;
  selectedModel: string;
  isLoading: boolean;
  isDisabled: boolean;
  onTemplateChange: (template: string) => void;
  onModelChange: (model: string) => void;
  onUploadFile: () => void;
  onAddUrl: () => void;
  onSendMessage: () => void;
  getSendButtonContent: () => React.ReactNode;
}

export const MessageControls: React.FC<MessageControlsProps> = ({
  selectedTemplate,
  selectedModel,
  isLoading,
  isDisabled,
  onTemplateChange,
  onModelChange,
  onUploadFile,
  onAddUrl,
  onSendMessage,
  getSendButtonContent
}) => {
  return (
    <div className="flex items-center justify-between px-4 pb-4 gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <AttachmentButton
          isLoading={isLoading}
          onUploadFile={onUploadFile}
          onAddUrl={onAddUrl}
        />

        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={onTemplateChange}
        />

        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-xl border-gray-200 bg-white" 
          disabled={isLoading}
        >
          <Mic className="h-4 w-4" />
        </Button>

        <Button 
          onClick={onSendMessage} 
          disabled={isDisabled} 
          size="icon" 
          className="h-10 w-10 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-600"
        >
          {getSendButtonContent()}
        </Button>
      </div>
    </div>
  );
};
