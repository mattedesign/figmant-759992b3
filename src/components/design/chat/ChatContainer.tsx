
import React from 'react';
import { MobileChatContainer } from './MobileChatContainer';
import { DesktopChatContainer } from './DesktopChatContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ChatMessage as ChatMessageType, ChatAttachment } from '../DesignChatInterface';
import type { ProcessingJob, SystemHealth } from '@/hooks/useImageProcessingMonitor';

interface ChatContainerProps {
  messages: ChatMessageType[];
  attachments: ChatAttachment[];
  message: string;
  urlInput: string;
  showUrlInput: boolean;
  storageStatus: 'checking' | 'ready' | 'error';
  storageErrorDetails?: any;
  showDebugPanel: boolean;
  showProcessingMonitor: boolean;
  lastAnalysisResult?: any;
  pendingImageProcessing: Set<string>;
  jobs: ProcessingJob[];
  systemHealth: SystemHealth;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleUrlInput: () => void;
  onUrlInputChange: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
  onRemoveAttachment: (id: string) => void;
  onRetryAttachment: (id: string) => void;
  onClearAllAttachments: () => void;
  onImageProcessed: (attachmentId: string, processedFile: File, processingInfo: any) => void;
  onImageProcessingError: (attachmentId: string, error: string) => void;
  onToggleDebugPanel: () => void;
  onToggleProcessingMonitor: () => void;
  onStorageStatusChange: (status: 'checking' | 'ready' | 'error') => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isLoading: boolean;
  canSendMessage: boolean;
  pauseJob: (id: string) => void;
  resumeJob: (id: string) => void;
  cancelJob: (id: string) => void;
  loadingState: any;
  getStageMessage: (stage: string) => string;
}

export const ChatContainer: React.FC<ChatContainerProps> = (props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="h-full bg-transparent">
        <MobileChatContainer {...props} />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-full bg-transparent">
      <DesktopChatContainer {...props} />
    </div>
  );
};
