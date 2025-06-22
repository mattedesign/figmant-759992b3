
import React, { useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, X, Loader2, Image, Link } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { SingleAttachmentDisplay } from './SingleAttachmentDisplay';
import { URLInputHandler } from '../analysis/components/URLInputHandler';
import { useFileUploadHandler } from '../analysis/useFileUploadHandler';

interface PersistentChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[] | ((prev: ChatAttachment[]) => ChatAttachment[])) => void;
  onSendMessage: () => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

export const PersistentChatInput: React.FC<PersistentChatInputProps> = ({
  message,
  setMessage,
  attachments,
  setAttachments,
  onSendMessage,
  isAnalyzing,
  disabled
}) => {
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { handleFileUpload } = useFileUploadHandler({
    setAttachments
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isAnalyzing && (message.trim() || attachments.length > 0)) {
        onSendMessage();
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      // Create a FileList-like object with a single file
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => index === 0 ? file : null,
        [Symbol.iterator]: function* () { yield file; }
      } as FileList;
      handleFileUpload(fileList);
    });
    e.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleAttachmentAdd = (attachment: ChatAttachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleAttachmentUpdate = (id: string, updates: Partial<ChatAttachment>) => {
    setAttachments(prev => prev.map(att => 
      att.id === id ? { ...att, ...updates } : att
    ));
  };

  const canSend = !disabled && !isAnalyzing && (message.trim() || attachments.length > 0);

  return (
    <div className="space-y-3">
      {/* URL Input */}
      <URLInputHandler
        showUrlInput={showUrlInput}
        onClose={() => setShowUrlInput(false)}
        attachments={attachments}
        onAttachmentAdd={handleAttachmentAdd}
        onAttachmentUpdate={handleAttachmentUpdate}
      />

      {/* Attachments Display */}
      {attachments.length > 0 && (
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Attachments ({attachments.length})
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative group">
                <SingleAttachmentDisplay
                  attachment={attachment}
                  size="sm"
                  showRemove={true}
                  onRemove={removeAttachment}
                />
                {attachment.status && (
                  <Badge 
                    variant={attachment.status === 'uploaded' ? 'default' : 'secondary'}
                    className="absolute bottom-1 left-1 text-xs"
                  >
                    {attachment.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Please select or create a chat session..." : "Type your message here... (Shift+Enter for new line)"}
            disabled={disabled || isAnalyzing}
            className="min-h-[60px] max-h-[200px] resize-none pr-12"
            rows={2}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileSelect}
              disabled={disabled || isAnalyzing}
              className="h-8 w-8 p-0"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput(true)}
              disabled={disabled || isAnalyzing}
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={onSendMessage}
          disabled={!canSend}
          className="h-[60px] px-6"
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
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

      {/* Input Helper Text */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {disabled ? "Select a session to start chatting" : "Press Enter to send, Shift+Enter for new line"}
        </span>
        {message.length > 0 && (
          <span>{message.length} characters</span>
        )}
      </div>
    </div>
  );
};
