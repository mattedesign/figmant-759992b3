
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ProcessedImage } from '@/utils/imageProcessing';

export interface FileHandlerCallbacks {
  updateAttachmentStatus: (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    id: string,
    status: ChatAttachment['status'],
    errorMessage?: string,
    uploadPath?: string,
    processingInfo?: ProcessedImage
  ) => void;
}

export interface ImageProcessingHandlers {
  handleImageProcessed: (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    attachmentId: string,
    processedFile: File,
    processingInfo: ProcessedImage
  ) => Promise<void>;
  handleImageProcessingError: (
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>,
    attachmentId: string,
    error: string
  ) => void;
}

export interface FileDropHandlers {
  handleFileDrop: (
    acceptedFiles: File[],
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => Promise<void>;
}
