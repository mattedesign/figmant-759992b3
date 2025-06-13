
import { useState } from 'react';
import { updateAttachmentStatus } from './attachmentStatusManager';
import { createImageProcessingHandlers } from './imageProcessingHandlers';
import { createFileDropHandler } from './fileDropHandler';

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

  return {
    pendingImageProcessing,
    setPendingImageProcessing,
    handleImageProcessed,
    handleImageProcessingError,
    handleFileDrop,
    updateAttachmentStatus
  };
};
