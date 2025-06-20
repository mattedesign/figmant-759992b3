
import React, { ReactNode } from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileUploadService } from '../utils/fileUploadService';
import { useChatStateContext } from './ChatStateProvider';

interface ChatAttachmentHandlersProps {
  children: (handlers: AttachmentHandlers) => ReactNode;
}

interface AttachmentHandlers {
  handleFileUpload: (files: FileList) => Promise<void>;
  handleAttachmentAdd: (attachment: ChatAttachment) => void;
  handleAttachmentUpdate: (id: string, updates: Partial<ChatAttachment>) => void;
  removeAttachment: (id: string) => void;
}

export const ChatAttachmentHandlers: React.FC<ChatAttachmentHandlersProps> = ({ children }) => {
  const { setAttachments, toast } = useChatStateContext();

  const handleFileUpload = async (files: FileList) => {
    console.log('📎 ATTACHMENT HANDLERS - Starting file upload for', files.length, 'files');
    
    const newAttachments: ChatAttachment[] = [];
    
    for (const file of Array.from(files)) {
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'uploading'
      };
      newAttachments.push(attachment);
      console.log('📎 ATTACHMENT HANDLERS - Created file attachment:', attachment.id, attachment.name);
    }
    
    // Add attachments to state immediately so they appear in the UI
    setAttachments(prev => {
      const updated = [...prev, ...newAttachments];
      console.log('📎 ATTACHMENT HANDLERS - Updated attachments state, new count:', updated.length);
      return updated;
    });
    
    toast({
      title: "Files Added",
      description: `${newAttachments.length} file(s) added for analysis.`,
    });
    
    // Process file uploads in background
    for (const attachment of newAttachments) {
      try {
        console.log('📤 Starting file upload for:', attachment.name);
        const uploadPath = await FileUploadService.uploadFile(attachment.file!, attachment.id);
        
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'uploaded', uploadPath }
            : att
        ));
        
        console.log('📤 File upload completed:', uploadPath);
        
      } catch (error) {
        console.error('📤 File upload failed:', error);
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'error' }
            : att
        ));
      }
    }
  };

  const handleAttachmentAdd = (attachment: ChatAttachment) => {
    console.log('🔗 ATTACHMENT HANDLERS - Adding attachment:', attachment);
    setAttachments(prev => {
      const updated = [...prev, attachment];
      console.log('🔗 ATTACHMENT HANDLERS - Attachments updated, new count:', updated.length);
      return updated;
    });
  };

  const handleAttachmentUpdate = (id: string, updates: Partial<ChatAttachment>) => {
    console.log('🔗 ATTACHMENT HANDLERS - Updating attachment:', id, updates);
    setAttachments(prev => prev.map(att => 
      att.id === id ? { ...att, ...updates } : att
    ));
  };

  const removeAttachment = (id: string) => {
    console.log('🗑️ ATTACHMENT HANDLERS - Removing attachment:', id);
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== id);
      console.log('🗑️ ATTACHMENT HANDLERS - Attachment removed, new count:', updated.length);
      return updated;
    });
  };

  const handlers: AttachmentHandlers = {
    handleFileUpload,
    handleAttachmentAdd,
    handleAttachmentUpdate,
    removeAttachment
  };

  return <>{children(handlers)}</>;
};
