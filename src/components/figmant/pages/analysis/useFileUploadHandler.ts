
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { validateAndProcessImageFile } from '@/components/design/chat/handlers/fileValidation';

// Utility function to sanitize file names for storage
const sanitizeFileName = (fileName: string): string => {
  // Remove or replace problematic characters
  const sanitized = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
  
  return sanitized;
};

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
            errorMessage: errorMessage,
            uploadPath
          }
        : att
    ));
  };

  const handleFileUpload = async (files: FileList) => {
    console.log('📁 FIGMANT CHAT - Starting file upload process for', files.length, 'files');
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attachmentId = crypto.randomUUID();
      
      console.log('📁 FIGMANT CHAT - Processing file:', file.name, 'Size:', file.size);
      
      // Add file to attachments with processing status
      const newAttachment: ChatAttachment = {
        id: attachmentId,
        type: 'file',
        name: file.name,
        file: file,
        status: 'processing',
        url: URL.createObjectURL(file)
      };
      
      setAttachments(prev => [...prev, newAttachment]);

      try {
        let fileToUpload = file;

        // Process images first if needed
        if (file.type.startsWith('image/')) {
          console.log('📁 FIGMANT CHAT - Processing image file:', file.name);
          updateAttachmentStatus(attachmentId, 'processing');

          const validationResult = await validateAndProcessImageFile(file);
          
          if (!validationResult.isValid) {
            throw new Error(validationResult.error || 'Image validation failed');
          }

          if (validationResult.processedFile) {
            fileToUpload = validationResult.processedFile;
            console.log('📁 FIGMANT CHAT - Image processed successfully:', {
              original: file.size,
              processed: fileToUpload.size
            });
          }
        }

        // Upload to Supabase storage with sanitized filename
        updateAttachmentStatus(attachmentId, 'uploading');
        const sanitizedFileName = sanitizeFileName(fileToUpload.name);
        const fileName = `${Date.now()}-${sanitizedFileName}`;
        
        console.log('📁 FIGMANT CHAT - Uploading file with sanitized name:', fileName);
        
        const { data, error } = await supabase.storage
          .from('design-uploads')
          .upload(`figmant-chat/${fileName}`, fileToUpload);

        if (error) {
          console.error('📁 FIGMANT CHAT - Supabase upload error:', error);
          throw error;
        }

        console.log('📁 FIGMANT CHAT - Upload successful:', data.path);

        // Update attachment with success status
        updateAttachmentStatus(attachmentId, 'uploaded', undefined, data.path);

        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });

      } catch (error) {
        console.error('📁 FIGMANT CHAT - Upload error:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateAttachmentStatus(attachmentId, 'error', errorMessage);

        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${errorMessage}`,
        });
      }
    }
  };

  return {
    handleFileUpload
  };
};
