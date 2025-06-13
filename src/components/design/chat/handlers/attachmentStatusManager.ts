
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ProcessedImage } from '@/utils/imageProcessing';

export const updateAttachmentStatus = (
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
