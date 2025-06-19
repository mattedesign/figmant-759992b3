
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FileUploadHandlersProps {
  onUploadComplete: (file: File, uploadPath: string) => void;
  onUploadError: (error: string) => void;
}

export const useFileUploadHandlers = ({ onUploadComplete, onUploadError }: FileUploadHandlersProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = async (files: FileList) => {
    if (!user?.id) {
      onUploadError('User not authenticated');
      return;
    }

    for (const file of Array.from(files)) {
      try {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          onUploadError(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `chat-attachments/${user.id}/${fileName}`;

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('design-assets')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          onUploadError(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        onUploadComplete(file, filePath);
        
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`
        });

      } catch (error) {
        console.error('File upload error:', error);
        onUploadError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return { handleFileUpload };
};
