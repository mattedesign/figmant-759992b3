
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
  console.log(`=== ATTACHMENT STATUS UPDATE ===`);
  console.log(`Updating attachment ${id}: ${status}`);
  if (errorMessage) console.log(`Error: ${errorMessage}`);
  if (uploadPath) console.log(`Upload path: ${uploadPath}`);
  
  setAttachments(prev => {
    const existing = prev.find(att => att.id === id);
    if (!existing) {
      console.warn(`Attachment ${id} not found for status update`);
      return prev;
    }
    
    console.log(`Previous status: ${existing.status} -> New status: ${status}`);
    
    return prev.map(att => 
      att.id === id 
        ? { 
            ...att, 
            status, 
            errorMessage: errorMessage || undefined, 
            uploadPath: uploadPath || att.uploadPath, 
            processingInfo: processingInfo || att.processingInfo 
          }
        : att
    );
  });
};

export const clearAllAttachments = (
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
  setPendingImageProcessing: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  console.log('=== CLEARING ALL ATTACHMENTS ===');
  setAttachments([]);
  setPendingImageProcessing(new Set());
};

export const retryAttachment = (
  attachments: ChatAttachment[],
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
  id: string
) => {
  console.log(`=== RETRYING ATTACHMENT ${id} ===`);
  updateAttachmentStatus(attachments, setAttachments, id, 'pending', undefined);
};

export const removeAttachmentFromPending = (
  setPendingImageProcessing: React.Dispatch<React.SetStateAction<Set<string>>>,
  id: string
) => {
  console.log(`=== REMOVING FROM PENDING: ${id} ===`);
  setPendingImageProcessing(prev => {
    const updated = new Set(prev);
    updated.delete(id);
    return updated;
  });
};
