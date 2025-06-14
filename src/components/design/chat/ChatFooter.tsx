
import React from 'react';
import { MessageInput } from './MessageInput';
import { URLInput } from './URLInput';

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
      <div className="flex-shrink-0">
        <MessageInput
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
