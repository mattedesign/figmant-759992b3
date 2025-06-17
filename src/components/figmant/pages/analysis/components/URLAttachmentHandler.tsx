
import React from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';

interface URLAttachmentHandlerProps {
  urlInput: string;
  setUrlInput: (url: string) => void;
  setShowUrlInput: (show: boolean) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[]) => void;
  children: (handleAddUrl: () => void) => React.ReactNode;
}

export const URLAttachmentHandler: React.FC<URLAttachmentHandlerProps> = ({
  urlInput,
  setUrlInput,
  setShowUrlInput,
  attachments,
  setAttachments,
  children
}) => {
  const { toast } = useToast();

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      console.log('Adding URL:', urlInput);
      
      // Validate URL format
      let formattedUrl = urlInput.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      try {
        const urlObj = new URL(formattedUrl);
        const hostname = urlObj.hostname;

        // Check if URL already exists
        const urlExists = attachments.some(att => att.url === formattedUrl);
        if (urlExists) {
          toast({
            variant: "destructive",
            title: "URL Already Added",
            description: `${hostname} is already in your attachments.`,
          });
          return;
        }

        // Create new URL attachment
        const newAttachment: ChatAttachment = {
          id: crypto.randomUUID(),
          type: 'url',
          name: hostname,
          url: formattedUrl,
          status: 'uploaded'
        };

        console.log('Creating new URL attachment:', newAttachment);
        setAttachments([...attachments, newAttachment]);
        
        setUrlInput('');
        setShowUrlInput(false);
        
        toast({
          title: "Website Added",
          description: `${hostname} has been added for analysis.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid URL",
          description: "Please enter a valid website URL.",
        });
      }
    }
  };

  return <>{children(handleAddUrl)}</>;
};
