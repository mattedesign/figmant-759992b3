
import React from 'react';
import { MessageInput } from './MessageInput';
import { MobileMessageInput } from './MobileMessageInput';
import { URLInput } from './URLInput';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatFooterProps {
  message: string;
  urlInput: string;
  showUrlInput: boolean;
  isLoading: boolean;
  hasContent: boolean;
  canSendMessage: boolean;
  loadingState: any;
  getStageMessage: (stage: string) => string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  onUrlInputChange: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({
  message,
  urlInput,
  showUrlInput,
  isLoading,
  hasContent,
  canSendMessage,
  loadingState,
  getStageMessage,
  onMessageChange,
  onSendMessage,
  onToggleUrlInput,
  onUrlInputChange,
  onAddUrl,
  onCancelUrl
}) => {
  const isMobile = useIsMobile();
  const InputComponent = isMobile ? MobileMessageInput : MessageInput;

  return (
    <>
      {/* URL Input */}
      {showUrlInput && (
        <URLInput
          showUrlInput={showUrlInput}
          urlInput={urlInput}
          onUrlInputChange={onUrlInputChange}
          onAddUrl={onAddUrl}
          onCancel={onCancelUrl}
        />
      )}

      {/* Message Input */}
      <div className={isMobile ? '' : 'flex-shrink-0'}>
        <InputComponent
          message={message}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onToggleUrlInput={onToggleUrlInput}
          isLoading={isLoading}
          hasContent={hasContent}
          canSend={canSendMessage}
          loadingStage={getStageMessage(loadingState.stage)}
        />
      </div>
    </>
  );
};
