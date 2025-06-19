
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, Loader2, Plus, Mic, Zap } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

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
  isDragActive,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-sonnet');
  
  const isDisabled = !hasContent || isLoading || !canSend;
  const { open: openDropzone, ...restRootProps } = getRootProps();
  const inputProps = getInputProps();

  const getSendButtonContent = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    return <ArrowUp className="h-4 w-4" />;
  };

  const handleUploadFile = () => {
    setIsPopoverOpen(false);
    openDropzone();
  };

  const handleAddUrl = () => {
    setIsPopoverOpen(false);
    onToggleUrlInput();
  };

  return (
    <div className="p-4 bg-background">
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
          isDragActive
            ? 'border-primary ring-2 ring-primary ring-offset-2'
            : ''
        } ${isLoading ? 'opacity-70' : ''}`}
      >
        <input {...inputProps} />
        
        {/* Main input area */}
        <div className="p-4">
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={isDragActive ? "Drop files to attach" : "How can I help..."}
            className="w-full resize-none border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent text-base placeholder:text-gray-400 min-h-[60px]"
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
        </div>

        {/* Controls row - with improved spacing */}
        <div className="flex items-center justify-between px-4 pb-4 gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Add attachment button */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-gray-200 bg-white flex-shrink-0"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-white border border-gray-200 shadow-lg z-50" align="start">
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={handleUploadFile}
                    disabled={isLoading}
                  >
                    Upload File
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={handleAddUrl}
                  >
                    Add URL
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Prompt Template selector - responsive width */}
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white min-w-0 flex-1 max-w-[200px]">
                <div className="flex items-center gap-2 min-w-0">
                  <Zap className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <SelectValue placeholder="Prompt Template" className="truncate" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="competitor">Competitor Analysis</SelectItem>
                <SelectItem value="revenue">Revenue Impact</SelectItem>
                <SelectItem value="testing">A/B Testing</SelectItem>
                <SelectItem value="messaging">Copy Testing</SelectItem>
                <SelectItem value="hierarchy">Visual Hierarchy</SelectItem>
              </SelectContent>
            </Select>

            {/* Model selector - responsive width */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white min-w-0 w-32 flex-shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
                <SelectItem value="claude-haiku">Claude Haiku</SelectItem>
                <SelectItem value="claude-opus">Claude Opus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Microphone button */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-gray-200 bg-white"
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
            </Button>

            {/* Send button */}
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

        {/* Loading stage indicator */}
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
