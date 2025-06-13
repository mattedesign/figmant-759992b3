
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export const useAttachmentHandlers = (
  attachments: ChatAttachment[],
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
  setUrlInput: React.Dispatch<React.SetStateAction<string>>,
  setShowUrlInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  const addUrlAttachment = (urlInput: string) => {
    if (urlInput.trim()) {
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: new URL(urlInput).hostname,
        url: urlInput.trim(),
        status: 'uploaded'
      };
      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: `Website ${newAttachment.name} has been added for analysis.`,
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return {
    addUrlAttachment,
    removeAttachment
  };
};
