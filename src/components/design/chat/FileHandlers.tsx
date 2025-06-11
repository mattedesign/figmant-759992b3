
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateImageFile, ProcessedImage } from '@/utils/imageProcessing';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export const useFileHandlers = (storageStatus: 'checking' | 'ready' | 'error') => {
  const [pendingImageProcessing, setPendingImageProcessing] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    console.log('Uploading file to storage:', { fileName, filePath, fileSize: file.size });

    const { error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded successfully:', filePath);
    return filePath;
  };

  const updateAttachmentStatus = (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    id: string,
    status: ChatAttachment['status'],
    errorMessage?: string,
    uploadPath?: string,
    processingInfo?: ProcessedImage
  ) => {
    setAttachments(prev => prev.map(att => 
      att.id === id 
        ? { ...att, status, errorMessage, uploadPath, processingInfo }
        : att
    ));
  };

  const handleImageProcessed = async (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    attachmentId: string,
    processedFile: File,
    processingInfo: ProcessedImage
  ) => {
    try {
      console.log('Image processed, uploading to storage:', {
        attachmentId,
        originalSize: processingInfo.originalSize,
        processedSize: processingInfo.processedSize,
        compressionRatio: processingInfo.compressionRatio
      });

      updateAttachmentStatus(attachments, setAttachments, attachmentId, 'uploading', undefined, undefined, processingInfo);

      const uploadPath = await uploadFileToStorage(processedFile);
      updateAttachmentStatus(attachments, setAttachments, attachmentId, 'uploaded', undefined, uploadPath, processingInfo);

      setPendingImageProcessing(prev => {
        const updated = new Set(prev);
        updated.delete(attachmentId);
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
        return updated;
      });

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    }
  };

  const handleImageProcessingError = (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    attachmentId: string,
    error: string
  ) => {
    console.error('Image processing failed:', { attachmentId, error });
    updateAttachmentStatus(attachments, setAttachments, attachmentId, 'error', error);
    
    setPendingImageProcessing(prev => {
      const updated = new Set(prev);
      updated.delete(attachmentId);
      return updated;
    });
  };

  const handleFileDrop = async (
    acceptedFiles: File[],
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => {
    if (storageStatus !== 'ready') {
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
        imageFiles.push(file);
      } else {
        nonImageFiles.push(file);
      }
    });

    // Handle non-image files with traditional upload
    for (const file of nonImageFiles) {
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'pending'
      };

      newAttachments.push(attachment);

      try {
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploading');
        const uploadPath = await uploadFileToStorage(file);
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'uploaded', undefined, uploadPath);
        
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateAttachmentStatus(attachments, setAttachments, attachment.id, 'error', errorMessage);
        
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${errorMessage}`,
        });
      }
    }

    // Handle image files with enhanced processing
    for (const file of imageFiles) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Invalid Image",
          description: validation.error,
        });
        continue;
      }

      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'processing'
      };

      newAttachments.push(attachment);
      setPendingImageProcessing(prev => new Set(prev).add(attachment.id));
    }

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  return {
    pendingImageProcessing,
    setPendingImageProcessing,
    handleImageProcessed,
    handleImageProcessingError,
    handleFileDrop,
    updateAttachmentStatus
  };
};
