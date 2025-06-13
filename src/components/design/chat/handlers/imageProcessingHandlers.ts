
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ProcessedImage } from '@/utils/imageProcessing';
import { uploadFileToStorage } from './fileUploadUtils';
import { updateAttachmentStatus } from './attachmentStatusManager';

export const createImageProcessingHandlers = (
  pendingImageProcessing: Set<string>,
  setPendingImageProcessing: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  const { toast } = useToast();

  const handleImageProcessed = async (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    attachmentId: string,
    processedFile: File,
    processingInfo: ProcessedImage
  ) => {
    console.log('=== IMAGE PROCESSING HANDLER TESTING ===');
    console.log('Processing completed for attachment:', attachmentId);
    console.log('Processed file details:', {
      name: processedFile.name,
      size: processedFile.size,
      type: processedFile.type
    });
    console.log('Processing info:', processingInfo);

    try {
      console.log('Image processed, uploading to storage:', {
        attachmentId,
        originalSize: processingInfo.originalSize,
        processedSize: processingInfo.processedSize,
        compressionRatio: processingInfo.compressionRatio
      });

      updateAttachmentStatus(attachments, setAttachments, attachmentId, 'uploading', undefined, undefined, processingInfo);

      const uploadPath = await uploadFileToStorage(processedFile);
      console.log('Upload completed successfully:', uploadPath);
      updateAttachmentStatus(attachments, setAttachments, attachmentId, 'uploaded', undefined, uploadPath, processingInfo);

      setPendingImageProcessing(prev => {
        const updated = new Set(prev);
        updated.delete(attachmentId);
        console.log('Removed from pending processing:', attachmentId);
        return updated;
      });

      toast({
        title: "Image Ready",
        description: processingInfo.compressionRatio > 0 
          ? `Image processed and uploaded (${processingInfo.compressionRatio}% compression)`
          : "Image uploaded successfully",
      });

    } catch (error) {
      console.error('Failed to upload processed image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      updateAttachmentStatus(attachments, setAttachments, attachmentId, 'error', errorMessage);
      
      setPendingImageProcessing(prev => {
        const updated = new Set(prev);
        updated.delete(attachmentId);
        console.log('Removed from pending processing due to error:', attachmentId);
        return updated;
      });

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    }
    console.log('=== IMAGE PROCESSING HANDLER TESTING COMPLETE ===');
  };

  const handleImageProcessingError = (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    attachmentId: string,
    error: string
  ) => {
    console.log('=== IMAGE PROCESSING ERROR HANDLER TESTING ===');
    console.error('Image processing failed:', { attachmentId, error });
    updateAttachmentStatus(attachments, setAttachments, attachmentId, 'error', error);
    
    setPendingImageProcessing(prev => {
      const updated = new Set(prev);
      updated.delete(attachmentId);
      console.log('Removed from pending processing due to error:', attachmentId);
      return updated;
    });
    console.log('=== IMAGE PROCESSING ERROR HANDLER TESTING COMPLETE ===');
  };

  return {
    handleImageProcessed,
    handleImageProcessingError
  };
};
