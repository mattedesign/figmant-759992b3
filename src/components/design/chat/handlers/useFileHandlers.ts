
import { useState } from 'react';
import { updateAttachmentStatus, clearAllAttachments, retryAttachment } from './attachmentStatusManager';
import { createImageProcessingHandlers } from './imageProcessingHandlers';
import { createFileDropHandler } from './fileDropHandler';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export const useFileHandlers = (storageStatus: 'checking' | 'ready' | 'error') => {
  const [pendingImageProcessing, setPendingImageProcessing] = useState<Set<string>>(new Set());

  const { handleImageProcessed, handleImageProcessingError } = createImageProcessingHandlers(
    pendingImageProcessing,
    setPendingImageProcessing
  );

  const { handleFileDrop } = createFileDropHandler(
    storageStatus,
    pendingImageProcessing,
    setPendingImageProcessing
  );

  const handleRetryAttachment = (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    id: string
  ) => {
    console.log('=== RETRY ATTACHMENT ===', id);
    const attachment = attachments.find(att => att.id === id);
    if (!attachment || !attachment.file) {
      console.error('Cannot retry: attachment or file not found');
      return;
    }

    // Reset status and retry processing
    retryAttachment(attachments, setAttachments, id);
    
    // Re-trigger file processing
    const isImage = attachment.file.type.startsWith('image/');
    if (isImage) {
      setPendingImageProcessing(prev => new Set(prev).add(id));
    }
    
    // The actual retry logic will be handled by the file drop handler
    handleFileDrop([attachment.file], attachments, setAttachments);
  };

  const handleClearAllAttachments = (
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => {
    clearAllAttachments(setAttachments, setPendingImageProcessing);
  };

  return {
    pendingImageProcessing,
    setPendingImageProcessing,
    handleImageProcessed,
    handleImageProcessingError,
    handleFileDrop,
    handleRetryAttachment,
    handleClearAllAttachments,
    updateAttachmentStatus
  };
};
