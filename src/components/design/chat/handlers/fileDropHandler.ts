
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { validateImageFile, ProcessedImage } from '@/utils/imageProcessing';
import { validateImageDimensions } from '@/utils/imageValidation';
import { resizeImageForClaudeAI } from '@/utils/imageResizer';
import { uploadFileToStorage } from './fileUploadUtils';
import { updateAttachmentStatus, removeAttachmentFromPending } from './attachmentStatusManager';

const MAX_RETRY_ATTEMPTS = 2;
const PROCESSING_TIMEOUT = 60000; // 60 seconds

export const createFileDropHandler = (
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
    try {
      if (isImage) {
        console.log(`Processing image file (attempt ${retryCount + 1}):`, file.name);
        
        // Set timeout for image processing
        const timeoutId = setTimeout(() => {
          console.error('Image processing timeout for:', file.name);
          updateAttachmentStatus(attachments, setAttachments, attachment.id, 'error', 'Processing timeout - file may be too large');
          removeAttachmentFromPending(setPendingImageProcessing, attachment.id);
        }, PROCESSING_TIMEOUT);

        try {
          // Basic validation
          const basicValidation = validateImageFile(file);
          if (!basicValidation.isValid) {
            throw new Error(basicValidation.error);
          }

          // Dimension validation
          const dimensionValidation = await validateImageDimensions(file);
          
          let fileToUpload = file;
          let processingInfo: ProcessedImage | undefined;

          if (!dimensionValidation.isValid && dimensionValidation.needsResize) {
            console.log('Image needs resizing:', file.name);
            updateAttachmentStatus(attachments, setAttachments, attachment.id, 'processing');
            
            const resizeResult = await resizeImageForClaudeAI(file);
            fileToUpload = resizeResult.file;
            processingInfo = {
              file: resizeResult.file,
              originalSize: file.size,
              processedSize: resizeResult.file.size,
              compressionRatio: resizeResult.compressionRatio,
              dimensions: resizeResult.newDimensions,
              format: 'jpeg'
            };
          } else if (!dimensionValidation.isValid) {
            throw new Error(dimensionValidation.error);
          }

          clearTimeout(timeoutId);
          
          // Upload the file
          updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploading');
          const uploadPath = await uploadFileToStorage(fileToUpload);
          updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploaded', undefined, uploadPath, processingInfo);
          
          removeAttachmentFromPending(setPendingImageProcessing, attachment.id);
          
          toast({
            title: "Image Ready",
            description: processingInfo 
              ? `${file.name} processed and uploaded successfully.`
              : `${file.name} uploaded successfully.`,
          });

        } catch (processingError) {
          clearTimeout(timeoutId);
          throw processingError;
        }
      } else {
        // Non-image file processing
        console.log(`Processing non-image file (attempt ${retryCount + 1}):`, file.name);
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploading');
        const uploadPath = await uploadFileToStorage(file);
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploaded', undefined, uploadPath);
        
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully.`,
        });
      }

    } catch (error) {
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
    }
  };

  const handleFileDrop = async (
    acceptedFiles: File[],
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => {
    console.log('=== ENHANCED FILE DROP HANDLER START ===');
    console.log('Storage status:', storageStatus);
    console.log('Files received:', acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));

    if (storageStatus !== 'ready') {
      console.log('Storage not ready, aborting file drop');
      toast({
        variant: "destructive",
        title: "Storage Not Ready",
        description: "File storage is not properly configured. Please wait or contact support.",
      });
      return;
    }

    const newAttachments: ChatAttachment[] = [];

    // Process all files
    for (const file of acceptedFiles) {
      const isImage = file.type.startsWith('image/');
      
      console.log(`Processing ${isImage ? 'image' : 'non-image'} file:`, file.name);
      
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'pending'
      };

      newAttachments.push(attachment);

      if (isImage) {
        setPendingImageProcessing(prev => new Set(prev).add(attachment.id));
      }

      // Start processing in background
      processFileWithRetry(file, attachment, attachments, setAttachments, isImage, 0);
    }

    console.log('Adding attachments to state:', newAttachments.length);
    setAttachments(prev => [...prev, ...newAttachments]);
    console.log('=== ENHANCED FILE DROP HANDLER COMPLETE ===');
  };

  return { handleFileDrop };
};
