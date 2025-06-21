
import { ChatAttachment } from '@/components/design/DesignChatInterface';

// Legacy attachment interface for backward compatibility
export interface LegacyAttachment {
  id: string;
  type: 'url' | 'file';
  name: string;
  uploadPath?: string;
  url?: string;
}

// Convert ChatAttachment to LegacyAttachment for APIs that expect the old format
export const convertToLegacyAttachment = (attachment: ChatAttachment): LegacyAttachment => {
  return {
    id: attachment.id,
    type: attachment.type === 'image' ? 'file' : attachment.type, // Convert image to file for legacy APIs
    name: attachment.name,
    uploadPath: attachment.uploadPath,
    url: attachment.url
  };
};

// Convert array of ChatAttachments to LegacyAttachments
export const convertToLegacyAttachments = (attachments: ChatAttachment[]): LegacyAttachment[] => {
  return attachments.map(convertToLegacyAttachment);
};

// Convert LegacyAttachment back to ChatAttachment
export const convertFromLegacyAttachment = (legacyAttachment: LegacyAttachment): ChatAttachment => {
  return {
    id: legacyAttachment.id,
    type: legacyAttachment.type,
    name: legacyAttachment.name,
    status: 'uploaded',
    uploadPath: legacyAttachment.uploadPath,
    url: legacyAttachment.url
  };
};
