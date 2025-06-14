
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { uploadFileToStorage } from './fileUploadUtils';
import { updateAttachmentStatus, removeAttachmentFromPending } from './attachmentStatusManager';
import { validateAndProcessImageFile } from './fileValidation';

const MAX_RETRY_ATTEMPTS = 2;
const PROCESSING_TIMEOUT = 60000; // 60 seconds

export const createFileProcessor = (
  storageStatus: 'checking' | 'ready' | 'error',
  pendingImageProcessing: Set<string>,
  setPendingImageProcessing: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  const { toast } = useToast();

  const processFileWithRetry = async (
    file: File,
    attachment: ChatAttachment,
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    isImage: boolean,
    retryCount: number = 0
  ): Promise<void> => {
    console.log(`=== PROCESS FILE WITH RETRY (${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1}) ===`);
    console.log('File:', file.name, 'Storage status:', storageStatus);

    try {
      if (isImage) {
        await processImageFile(file, attachment, attachments, setAttachments, retryCount);
      } else {
        await processNonImageFile(file, attachment, attachments, setAttachments, retryCount);
      }
    } catch (error) {
      await handleProcessingError(error, file, attachment, attachments, setAttachments, isImage, retryCount);
    }
  };

  const processImageFile = async (
    file: File,
    attachment: ChatAttachment,
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    retryCount: number
  ) => {
    console.log(`Processing image file (attempt ${retryCount + 1}):`, file.name);
    
    // Set timeout for image processing
    const timeoutId = setTimeout(() => {
      console.error('Image processing timeout for:', file.name);
      updateAttachmentStatus(attachments, setAttachments, attachment.id, 'error', 'Processing timeout - file may be too large');
      removeAttachmentFromPending(setPendingImageProcessing, attachment.id);
    }, PROCESSING_TIMEOUT);

    try {
      // Wait for storage to be ready if needed
      if (storageStatus === 'checking') {
        console.log('Storage still checking, waiting before upload...');
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'pending', 'Waiting for storage...');
        
        setTimeout(() => {
          processFileWithRetry(file, attachment, attachments, setAttachments, true, retryCount);
        }, 2000);
        return;
      }

      // Validate and process the image
      updateAttachmentStatus(attachments, setAttachments, attachment.id, 'processing');
      const validationResult = await validateAndProcessImageFile(file);
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      clearTimeout(timeoutId);
      
      // Upload the processed file
      const fileToUpload = validationResult.processedFile || file;
      updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploading');
      const uploadPath = await uploadFileToStorage(fileToUpload);
      updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploaded', undefined, uploadPath, validationResult.processingInfo);
      
      removeAttachmentFromPending(setPendingImageProcessing, attachment.id);
      
      toast({
        title: "Image Ready",
        description: validationResult.processingInfo 
          ? `${file.name} processed and uploaded successfully.`
          : `${file.name} uploaded successfully.`,
      });

    } catch (processingError) {
      clearTimeout(timeoutId);
      throw processingError;
    }
  };

  const processNonImageFile = async (
    file: File,
    attachment: ChatAttachment,
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    retryCount: number
  ) => {
    console.log(`Processing non-image file (attempt ${retryCount + 1}):`, file.name);
    
    // Wait for storage to be ready for non-image files too
    if (storageStatus === 'checking') {
      console.log('Storage checking, queueing non-image file...');
      updateAttachmentStatus(attachments, setAttachments, attachment.id, 'pending', 'Waiting for storage...');
      
      setTimeout(() => {
        processFileWithRetry(file, attachment, attachments, setAttachments, false, retryCount);
      }, 2000);
      return;
    }

    updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploading');
    const uploadPath = await uploadFileToStorage(file);
    updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploaded', undefined, uploadPath);
    
    toast({
      title: "File Uploaded",
      description: `${file.name} uploaded successfully.`,
    });
  };

  const handleProcessingError = async (
    error: unknown,
    file: File,
    attachment: ChatAttachment,
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    isImage: boolean,
    retryCount: number
  ) => {
    console.error(`File processing failed (attempt ${retryCount + 1}):`, file.name, error);
    
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      console.log(`Retrying file processing for ${file.name} (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      
      return processFileWithRetry(file, attachment, attachments, setAttachments, isImage, retryCount + 1);
    }
    
    // Final failure after all retries
    const errorMessage = error instanceof Error ? error.message : 'Processing failed';
    updateAttachmentStatus(attachments, setAttachments, attachment.id, 'error', `${errorMessage} (after ${MAX_RETRY_ATTEMPTS + 1} attempts)`);
    
    if (isImage) {
      removeAttachmentFromPending(setPendingImageProcessing, attachment.id);
    }
    
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: `Failed to process ${file.name}: ${errorMessage}`,
    });
  };

  return { processFileWithRetry };
};
