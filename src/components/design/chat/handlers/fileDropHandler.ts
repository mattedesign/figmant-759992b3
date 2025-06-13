
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { validateImageFile, ProcessedImage } from '@/utils/imageProcessing';
import { validateImageDimensions } from '@/utils/imageValidation';
import { resizeImageForClaudeAI } from '@/utils/imageResizer';
import { uploadFileToStorage } from './fileUploadUtils';
import { updateAttachmentStatus } from './attachmentStatusManager';

export const createFileDropHandler = (
  storageStatus: 'checking' | 'ready' | 'error',
  pendingImageProcessing: Set<string>,
  setPendingImageProcessing: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  const { toast } = useToast();

  const handleFileDrop = async (
    acceptedFiles: File[],
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => {
    console.log('=== FILE DROP HANDLER TESTING ===');
    console.log('Storage status:', storageStatus);
    console.log('Files received:', acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));

    if (storageStatus !== 'ready') {
      console.log('Storage not ready, aborting file drop');
      toast({
        variant: "destructive",
        title: "Storage Not Ready",
        description: "File storage is not properly configured. Please check with your administrator.",
      });
      return;
    }

    const newAttachments: ChatAttachment[] = [];
    const imageFiles: File[] = [];
    const nonImageFiles: File[] = [];

    // Separate image and non-image files
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        console.log('Detected image file:', file.name);
        imageFiles.push(file);
      } else {
        console.log('Detected non-image file:', file.name);
        nonImageFiles.push(file);
      }
    });

    // Handle non-image files with traditional upload
    for (const file of nonImageFiles) {
      console.log('Processing non-image file:', file.name);
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'pending'
      };

      newAttachments.push(attachment);

      try {
        console.log('Starting upload for:', file.name);
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploading');
        const uploadPath = await uploadFileToStorage(file);
        console.log('Upload successful for:', file.name, 'Path:', uploadPath);
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploaded', undefined, uploadPath);
        
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        console.error('Upload failed for:', file.name, error);
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'error', errorMessage);
        
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${errorMessage}`,
        });
      }
    }

    // Handle image files with enhanced validation and processing
    for (const file of imageFiles) {
      console.log('Processing image file:', file.name);
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'processing'
      };

      newAttachments.push(attachment);
      setPendingImageProcessing(prev => new Set(prev).add(attachment.id));

      try {
        // First validate basic file properties
        console.log('Validating image file:', file.name);
        const basicValidation = validateImageFile(file);
        if (!basicValidation.isValid) {
          console.error('Basic validation failed for:', file.name, basicValidation.error);
          throw new Error(basicValidation.error);
        }
        console.log('Basic validation passed for:', file.name);

        // Then validate dimensions for Claude AI compatibility
        console.log('Validating image dimensions for:', file.name);
        const dimensionValidation = await validateImageDimensions(file);
        
        let fileToUpload = file;
        let processingInfo: ProcessedImage | undefined;

        if (!dimensionValidation.isValid && dimensionValidation.needsResize) {
          console.log('Image needs resizing for Claude AI compatibility:', file.name);
          // Image needs resizing for Claude AI
          updateAttachmentStatus(attachments, setAttachments, attachment.id, 'processing');
          
          toast({
            title: "Resizing Image",
            description: `${file.name} is being resized for AI analysis compatibility.`,
          });

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

          console.log('Image resized successfully:', {
            original: resizeResult.originalDimensions,
            new: resizeResult.newDimensions,
            compression: resizeResult.compressionRatio
          });

          toast({
            title: "Image Resized",
            description: `${file.name} has been resized from ${resizeResult.originalDimensions.width}x${resizeResult.originalDimensions.height} to ${resizeResult.newDimensions.width}x${resizeResult.newDimensions.height}.`,
          });
        } else if (!dimensionValidation.isValid) {
          console.error('Dimension validation failed for:', file.name, dimensionValidation.error);
          // Image has validation errors that can't be fixed by resizing
          throw new Error(dimensionValidation.error);
        } else {
          console.log('Image dimensions are valid for:', file.name);
        }

        // Upload the file (original or resized)
        console.log('Starting upload for processed image:', file.name);
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploading');
        const uploadPath = await uploadFileToStorage(fileToUpload);
        console.log('Image upload successful:', file.name, 'Path:', uploadPath);
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploaded', undefined, uploadPath, processingInfo);

        setPendingImageProcessing(prev => {
          const updated = new Set(prev);
          updated.delete(attachment.id);
          return updated;
        });

        toast({
          title: "Image Ready",
          description: processingInfo 
            ? `${file.name} has been processed and uploaded successfully.`
            : `${file.name} has been uploaded successfully.`,
        });

      } catch (error) {
        console.error('Image processing failed for:', file.name, error);
        const errorMessage = error instanceof Error ? error.message : 'Processing failed';
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'error', errorMessage);
        
        setPendingImageProcessing(prev => {
          const updated = new Set(prev);
          updated.delete(attachment.id);
          return updated;
        });

        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: `Failed to process ${file.name}: ${errorMessage}`,
        });
      }
    }

    console.log('Adding attachments to state:', newAttachments.length);
    setAttachments(prev => [...prev, ...newAttachments]);
    console.log('=== FILE DROP HANDLER TESTING COMPLETE ===');
  };

  return { handleFileDrop };
};
