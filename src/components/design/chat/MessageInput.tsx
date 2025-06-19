
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
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    return <ArrowUp className="h-5 w-5" />;
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
    <div className="p-6 bg-background">
      <div
        {...restRootProps}
        className={`relative bg-white rounded-2xl border transition-colors ${
          isDragActive
            ? 'border-primary ring-2 ring-primary ring-offset-2'
            : 'border-gray-200'
        } ${isLoading ? 'opacity-70' : ''}`}
      >
        <input {...inputProps} />
        
        {/* Main input area */}
        <div className="p-6">
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={isDragActive ? "Drop files to attach" : "How can I help..."}
            className="w-full resize-none border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent text-base placeholder:text-gray-400 min-h-[80px]"
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between px-6 pb-6 gap-3">
          <div className="flex items-center gap-3">
            {/* Add attachment button */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-2xl border-gray-200 bg-white"
                  disabled={isLoading}
                >
                  <Plus className="h-5 w-5" />
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

            {/* Prompt Template selector */}
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-60 h-12 rounded-2xl border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <SelectValue placeholder="Prompt Template" />
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

            {/* Model selector */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
                <SelectItem value="claude-haiku">Claude Haiku</SelectItem>
                <SelectItem value="claude-opus">Claude Opus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            {/* Microphone button */}
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-2xl border-gray-200 bg-white"
              disabled={isLoading}
            >
              <Mic className="h-5 w-5" />
            </Button>

            {/* Send button */}
            <Button
              onClick={onSendMessage}
              disabled={isDisabled}
              size="icon"
              className="h-12 w-12 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-600"
            >
              {getSendButtonContent()}
            </Button>
          </div>
        </div>

        {/* Loading stage indicator */}
        {isLoading && loadingStage && (
          <div className="px-6 pb-2">
            <div className="text-center text-xs text-muted-foreground">
              {loadingStage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
