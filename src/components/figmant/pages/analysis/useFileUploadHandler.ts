
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { validateAndProcessImageFile } from '@/components/design/chat/handlers/fileValidation';

export const useFileUploadHandler = (setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>) => {
  const { toast } = useToast();

  const updateAttachmentStatus = (
    attachmentId: string, 
    status: ChatAttachment['status'], 
    errorMessage?: string,
    uploadPath?: string
  ) => {
    setAttachments(prev => prev.map(att => 
      att.id === attachmentId 
        ? { 
            ...att, 
            status, 
            error: errorMessage,
            uploadPath
          }
        : att
    ));
  };

  const handleFileUpload = async (file: File) => {
    const attachmentId = crypto.randomUUID();
    
    // Add file to attachments with uploading status
    const newAttachment: ChatAttachment = {
      id: attachmentId,
      type: 'file',
      name: file.name,
      file: file,
      status: 'uploading',
      url: URL.createObjectURL(file)
    };
    
    setAttachments(prev => [...prev, newAttachment]);

    try {
      let fileToUpload = file;

      // Process images first if needed
      if (file.type.startsWith('image/')) {
        console.log('Processing image file:', file.name);
        updateAttachmentStatus(attachmentId, 'processing');

        const validationResult = await validateAndProcessImageFile(file);
        
        if (!validationResult.isValid) {
          throw new Error(validationResult.error || 'Image validation failed');
        }

        if (validationResult.processedFile) {
          fileToUpload = validationResult.processedFile;
          console.log('Image processed successfully:', {
            original: file.size,
            processed: fileToUpload.size
          });
        }
      }

      // Upload to Supabase storage
      updateAttachmentStatus(attachmentId, 'uploading');
      const fileName = `${Date.now()}-${fileToUpload.name}`;
      const { data, error } = await supabase.storage
        .from('design-uploads')
        .upload(`figmant-chat/${fileName}`, fileToUpload);

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // Update attachment with success status
      updateAttachmentStatus(attachmentId, 'uploaded', undefined, data.path);

      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      updateAttachmentStatus(attachmentId, 'error', errorMessage);

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: `Failed to upload ${file.name}: ${errorMessage}`,
      });
    }
  };

  return {
    handleFileUpload
  };
};
