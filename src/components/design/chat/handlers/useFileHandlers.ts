
import { useState } from 'react';
import { updateAttachmentStatus, clearAllAttachments, retryAttachment } from './attachmentStatusManager';
import { createImageProcessingHandlers } from './imageProcessingHandlers';
import { createFileDropHandler } from './fileDropHandler';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export const useFileHandlers = (storageStatus: 'checking' | 'ready' | 'error') => {
  const [pendingImageProcessing, setPendingImageProcessing] = useState<Set<string>>(new Set());

  console.log('=== FILE HANDLERS DEBUG ===');
  console.log('Storage status in handlers:', storageStatus);
  console.log('Pending image processing count:', pendingImageProcessing.size);

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
    console.log('=== RETRY ATTACHMENT HANDLER ===', id);
    console.log('Current storage status:', storageStatus);
    
    const attachment = attachments.find(att => att.id === id);
    if (!attachment || !attachment.file) {
      console.error('Cannot retry: attachment or file not found');
      return;
    }

    console.log('Retrying attachment:', {
      id,
      name: attachment.name,
      type: attachment.type,
      status: attachment.status
    });

    // Reset status and retry processing
    retryAttachment(attachments, setAttachments, id);
    
    // Re-trigger file processing
    const isImage = attachment.file.type.startsWith('image/');
    if (isImage) {
      console.log('Adding to pending image processing:', id);
      setPendingImageProcessing(prev => new Set(prev).add(id));
    }
    
    // The actual retry logic will be handled by the file drop handler
    console.log('Triggering file drop handler for retry');
    handleFileDrop([attachment.file], attachments, setAttachments);
  };

  const handleClearAllAttachments = (
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => {
    console.log('=== CLEAR ALL ATTACHMENTS ===');
    console.log('Clearing all attachments and pending processing');
    
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
