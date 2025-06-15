import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Paperclip, Upload, Link } from 'lucide-react';
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
  const isDisabled = !hasContent || isLoading || !canSend;
  const { open: openDropzone, ...restRootProps } = getRootProps();
  const inputProps = getInputProps();

  const getSendButtonContent = () => {
    if (isLoading) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    return <Send className="h-5 w-5" />;
  };

  return (
    <div className="bg-background border-t p-2">
      <div
        {...restRootProps}
        className={`relative border rounded-lg transition-colors bg-background flex items-start p-1 gap-1 ${
          isDragActive ? 'border-primary ring-2 ring-primary' : 'border-input'
        } ${isLoading ? 'opacity-70' : ''}`}
      >
        <input {...inputProps} />
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0 h-10 w-10" disabled={isLoading}>
              <Paperclip className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Attach Content</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pt-0 space-y-2">
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full" onClick={openDropzone} disabled={isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full" onClick={onToggleUrlInput}>
                    <Link className="mr-2 h-4 w-4" />
                    Add URL
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={isDragActive ? "Drop files..." : "Message..."}
          className="flex-1 min-h-[40px] max-h-32 resize-none border-0 shadow-none focus-visible:ring-0 text-base bg-transparent self-center"
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          rows={1}
        />

        <div className="flex items-end">
          <Button
            onClick={onSendMessage}
            disabled={isDisabled}
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            {getSendButtonContent()}
          </Button>
        </div>
      </div>
      
      {isLoading && loadingStage && (
        <div className="text-center text-xs text-muted-foreground pt-2">
          {loadingStage}
        </div>
      )}
    </div>
  );
};
