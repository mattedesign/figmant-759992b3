
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, Loader2, Plus, Mic, Zap } from 'lucide-react';
import { useIsSmallMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';

interface MobileMessageInputProps {
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

export const MobileMessageInput: React.FC<MobileMessageInputProps> = ({
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
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-sonnet');
  const isDisabled = !hasContent || isLoading || !canSend;
  const isSmallMobile = useIsSmallMobile();
  const { open: openDropzone, ...restRootProps } = getRootProps();
  const inputProps = getInputProps();

  const getSendButtonContent = () => {
    if (isLoading) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    return <ArrowUp className="h-5 w-5" />;
  };

  return (
    <div className="bg-background border-t p-4 safe-bottom">
      {/* Mobile controls row - top */}
      <div className="flex items-center gap-2 mb-3">
        {/* Prompt Template selector */}
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger className="flex-1 h-10 rounded-xl border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <SelectValue placeholder="Template" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="competitor">Competitor Analysis</SelectItem>
            <SelectItem value="revenue">Revenue Impact</SelectItem>
            <SelectItem value="testing">A/B Testing</SelectItem>
            <SelectItem value="messaging">Copy Testing</SelectItem>
            <SelectItem value="hierarchy">Visual Hierarchy</SelectItem>
          </SelectContent>
        </Select>

        {/* Model selector */}
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-32 h-10 rounded-xl border-gray-200 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="claude-sonnet">Sonnet</SelectItem>
            <SelectItem value="claude-haiku">Haiku</SelectItem>
            <SelectItem value="claude-opus">Opus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main input container */}
      <div
        {...restRootProps}
        className={`relative bg-white rounded-2xl border transition-colors ${
          isDragActive ? 'border-primary ring-2 ring-primary' : 'border-gray-200'
        } ${isLoading ? 'opacity-70' : ''}`}
      >
        <input {...inputProps} />
        
        {/* Text input area */}
        <div className="p-3">
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={isDragActive ? "Drop files..." : "How can I help..."}
            className={`w-full resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-gray-400 ${
              isSmallMobile ? 'min-h-[50px] text-base' : 'min-h-[44px] text-sm'
            }`}
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            rows={1}
          />
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between px-3 pb-3 gap-2">
          {/* Left side controls */}
          <div className="flex items-center gap-2">
            {/* Add attachment button */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-xl border-gray-200 ${isSmallMobile ? 'h-10 w-10' : 'h-9 w-9'}`} 
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Attach Content</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 pt-0 space-y-3">
                    <DrawerClose asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-base" 
                        onClick={openDropzone} 
                        disabled={isLoading}
                      >
                        Upload File
                      </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-base" 
                        onClick={onToggleUrlInput}
                      >
                        Add URL
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Microphone button */}
            <Button
              variant="outline"
              size="icon"
              className={`rounded-xl border-gray-200 ${isSmallMobile ? 'h-10 w-10' : 'h-9 w-9'}`}
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={onSendMessage}
            disabled={isDisabled}
            size="icon"
            className={`rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-600 ${isSmallMobile ? 'h-10 w-10' : 'h-9 w-9'}`}
          >
            {getSendButtonContent()}
          </Button>
        </div>

        {/* Loading stage indicator */}
        {isLoading && loadingStage && (
          <div className="px-3 pb-2">
            <div className="text-center text-xs text-muted-foreground">
              {loadingStage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
