
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface UseFileUploadHandlerProps {
  attachments: ChatAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>;
}

export const useFileUploadHandler = ({
  attachments,
  setAttachments
}: UseFileUploadHandlerProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
    }
  };

  const handleAddUrl = (urlInput: string, setUrlInput: (value: string) => void, setShowUrlInput: (show: boolean) => void) => {
    if (urlInput.trim()) {
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: urlInput,
        url: urlInput,
        status: 'uploaded'
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: "Website URL added for analysis",
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return {
    handleFileUpload,
    handleAddUrl,
    removeAttachment
  };
};
