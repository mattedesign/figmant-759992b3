
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { createFileProcessor } from './fileProcessor';

export const createFileDropHandler = (
  storageStatus: 'checking' | 'ready' | 'error',
  pendingImageProcessing: Set<string>,
  setPendingImageProcessing: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  const { toast } = useToast();
  const { processFileWithRetry } = createFileProcessor(
    storageStatus,
    pendingImageProcessing,
    setPendingImageProcessing
  );

  const handleFileDrop = async (
    acceptedFiles: File[],
    attachments: ChatAttachment[],
    setAttachments: React.Dispatch<React.SetStateAction<ChatAttachment[]>>
  ) => {
    console.log('=== ENHANCED FILE DROP HANDLER START ===');
    console.log('Storage status:', storageStatus);
    console.log('Files received:', acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));

    // Allow files to be queued even if storage is not ready
    if (storageStatus === 'error') {
      console.log('Storage in error state, showing warning but allowing queue');
      toast({
        title: "Storage Issue",
        description: "Files will be queued and processed when storage becomes available.",
      });
    }

    const newAttachments: ChatAttachment[] = [];

    // Process all files
    for (const file of acceptedFiles) {
      const isImage = file.type.startsWith('image/');
      
      console.log(`Processing ${isImage ? 'image' : 'non-image'} file:`, file.name);
      
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'pending'
      };

      newAttachments.push(attachment);

      if (isImage) {
        setPendingImageProcessing(prev => new Set(prev).add(attachment.id));
      }

      // Start processing in background
      processFileWithRetry(file, attachment, attachments, setAttachments, isImage, 0);
    }

    console.log('Adding attachments to state:', newAttachments.length);
    setAttachments(prev => [...prev, ...newAttachments]);
    console.log('=== ENHANCED FILE DROP HANDLER COMPLETE ===');
  };

  return { handleFileDrop };
};
