
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export const useFileUploadHandler = (setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>) => {
  const { toast } = useToast();

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
      // Upload to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('design-uploads')
        .upload(`figmant-chat/${fileName}`, file);

      if (error) throw error;

      // Update attachment with success status
      setAttachments(prev => prev.map(att => 
        att.id === attachmentId 
          ? { ...att, status: 'uploaded' as const, uploadPath: data.path }
          : att
      ));

      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      // Update attachment with error status
      setAttachments(prev => prev.map(att => 
        att.id === attachmentId 
          ? { ...att, status: 'error' as const }
          : att
      ));

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: `Failed to upload ${file.name}`,
      });
    }
  };

  return {
    handleFileUpload
  };
};
