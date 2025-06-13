
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

const SUPPORTED_DOMAINS = [
  'amazon.com', 'ebay.com', 'etsy.com', 'shopify.com', 'wix.com', 'squarespace.com',
  'nike.com', 'adidas.com', 'apple.com', 'google.com', 'microsoft.com', 'netflix.com',
  'airbnb.com', 'booking.com', 'uber.com', 'spotify.com', 'figma.com', 'behance.net',
  'dribbble.com', 'github.com', 'stackoverflow.com', 'medium.com', 'linkedin.com',
  'youtube.com', 'salesforce.com', 'hubspot.com', 'slack.com'
];

export const useAttachmentHandlers = (
  attachments: ChatAttachment[],
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
  setUrlInput: React.Dispatch<React.SetStateAction<string>>,
  setShowUrlInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  const validateUrl = (url: string): { isValid: boolean; hostname?: string; message?: string } => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Check if domain is supported
      const isSupported = SUPPORTED_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );

      if (!isSupported) {
        return {
          isValid: false,
          hostname,
          message: `Domain "${hostname}" is not currently supported. Please use screenshots instead.`
        };
      }

      return { isValid: true, hostname };
    } catch {
      return {
        isValid: false,
        message: 'Please enter a valid URL (e.g., https://example.com)'
      };
    }
  };

  const addUrlAttachment = (urlInput: string) => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
      return;
    }

    const validation = validateUrl(trimmedUrl);
    
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Domain Not Supported",
        description: validation.message || "This domain is not currently supported for analysis.",
      });
      return;
    }

    const fullUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
    
    // Check if URL is already added
    const urlExists = attachments.some(att => att.url === fullUrl);
    if (urlExists) {
      toast({
        variant: "destructive",
        title: "URL Already Added",
        description: `${validation.hostname} is already in your attachments.`,
      });
      return;
    }

    const newAttachment: ChatAttachment = {
      id: crypto.randomUUID(),
      type: 'url',
      name: validation.hostname || new URL(fullUrl).hostname,
      url: fullUrl,
      status: 'uploaded'
    };
    
    setAttachments(prev => [...prev, newAttachment]);
    setUrlInput('');
    setShowUrlInput(false);
    
    toast({
      title: "Website Added",
      description: `${newAttachment.name} has been added for analysis.`,
    });
  };

  const removeAttachment = (id: string) => {
    const attachment = attachments.find(att => att.id === id);
    setAttachments(prev => prev.filter(att => att.id !== id));
    
    if (attachment) {
      toast({
        title: "Attachment Removed",
        description: `${attachment.name} has been removed.`,
      });
    }
  };

  return {
    addUrlAttachment,
    removeAttachment,
    validateUrl
  };
};
