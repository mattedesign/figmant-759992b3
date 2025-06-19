
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, Loader2 } from 'lucide-react';
import { MessageControls } from './MessageInput/MessageControls';

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  isLoading: boolean;
  hasContent: boolean;
  canSend?: boolean;
  loadingStage?: string;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  isLoading,
  hasContent,
  canSend = true,
  loadingStage,
  getRootProps,
  getInputProps,
  isDragActive
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-sonnet');
  const isDisabled = !hasContent || isLoading || !canSend;

  const {
    open: openDropzone,
    ...restRootProps
  } = getRootProps();
  const inputProps = getInputProps();

  const getSendButtonContent = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    return <ArrowUp className="h-4 w-4" />;
  };

  const handleUploadFile = () => {
    openDropzone();
  };

  return (
    <div className="p-4 bg-transparent">
      <div 
        {...restRootProps} 
        style={{
          display: 'flex',
          padding: '12px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          alignSelf: 'stretch',
          borderRadius: '24px',
          border: '1px solid var(--Stroke-01, #ECECEC)',
          background: 'var(--Surface-01, #FCFCFC)',
          boxShadow: '0px 18px 24px -20px rgba(0, 0, 0, 0.13), 0px 2px 0px 0px #FFF inset, 0px 8px 16px -12px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(6px)'
        }} 
        className={`relative transition-colors ${
          isDragActive ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
        } ${isLoading ? 'opacity-70' : ''}`}
      >
        <input {...inputProps} />
        
        <div className="p-4">
          <Textarea 
            value={message} 
            onChange={e => onMessageChange(e.target.value)} 
            placeholder={isDragActive ? "Drop files to attach" : "How can I help..."} 
            className="w-full resize-none border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent text-base placeholder:text-gray-400 min-h-[60px]" 
            disabled={isLoading} 
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
                e.preventDefault();
                onSendMessage();
              }
            }} 
          />
        </div>

        <MessageControls
          selectedTemplate={selectedTemplate}
          selectedModel={selectedModel}
          isLoading={isLoading}
          isDisabled={isDisabled}
          onTemplateChange={setSelectedTemplate}
          onModelChange={setSelectedModel}
          onUploadFile={handleUploadFile}
          onAddUrl={onToggleUrlInput}
          onSendMessage={onSendMessage}
          getSendButtonContent={getSendButtonContent}
        />

        {isLoading && loadingStage && (
          <div className="px-4 pb-2">
            <div className="text-center text-xs text-muted-foreground">
              {loadingStage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
