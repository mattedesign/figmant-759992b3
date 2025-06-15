
import { useDropzone } from 'react-dropzone';
import type { ChatAttachment } from '@/components/design/DesignChatInterface';

interface UseChatDropzoneProps {
  handleFileDrop: (
    acceptedFiles: File[],
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => void;
  attachments: ChatAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>;
  storageStatus: 'checking' | 'ready' | 'error';
  isLoading: boolean;
}

export const useChatDropzone = ({
  handleFileDrop,
  attachments,
  setAttachments,
  storageStatus,
  isLoading,
}: UseChatDropzoneProps) => {
  const {
    getRootProps: originalGetRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('=== DROPZONE FILE DROP ===');
      console.log('Files dropped:', acceptedFiles.length);
      console.log('Current storage status:', storageStatus);
      console.log('Is loading:', isLoading);

      if (isLoading) {
        console.warn('Dropzone: Currently loading, ignoring file drop');
        return;
      }

      if (storageStatus !== 'ready') {
        console.warn('Dropzone: Storage not ready, files will be queued');
      }

      handleFileDrop(acceptedFiles, attachments, setAttachments);
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    noClick: true,
    noDrag: isLoading,
  });

  const getRootProps = (props?: any) => ({
    ...originalGetRootProps(props),
    open,
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
};
