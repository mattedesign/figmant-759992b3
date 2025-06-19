
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageInput } from '@/components/design/chat/MessageInput';
import { MobileMessageInput } from '@/components/design/chat/MobileMessageInput';
import { useDropzone } from 'react-dropzone';

interface MessageInputSectionProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onFileUpload?: (files: FileList) => void;
  onToggleUrlInput: () => void;
  isAnalyzing: boolean;
  canSend: boolean;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  onFileUpload,
  onToggleUrlInput,
  isAnalyzing,
  canSend
}) => {
  const isMobile = useIsMobile();

  // Setup dropzone for file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (onFileUpload && acceptedFiles.length > 0) {
        const fileList = new DataTransfer();
        acceptedFiles.forEach(file => fileList.items.add(file));
        onFileUpload(fileList.files);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    noClick: true
  });

  const commonProps = {
    message,
    onMessageChange,
    onSendMessage,
    onToggleUrlInput,
    isLoading: isAnalyzing,
    hasContent: message.trim().length > 0,
    canSend,
    loadingStage: isAnalyzing ? 'Analyzing...' : undefined,
    getRootProps,
    getInputProps,
    isDragActive
  };

  if (isMobile) {
    return <MobileMessageInput {...commonProps} />;
  }

  return <MessageInput {...commonProps} />;
};
