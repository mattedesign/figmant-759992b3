
import { useDropzone } from 'react-dropzone';
import { useChatInterfaceState } from './useChatInterfaceState';
import { useAttachmentHandlers } from './useAttachmentHandlers';
import { useChatMessageHandlers } from './useChatMessageHandlers';
import { useFileHandlers } from '../handlers/useFileHandlers';
import { useImageProcessingMonitor } from '@/hooks/useImageProcessingMonitor';

export const useDesignChatLogic = () => {
  const {
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    urlInput,
    setUrlInput,
    showUrlInput,
    setShowUrlInput,
    storageStatus,
    setStorageStatus,
    storageErrorDetails,
    setStorageErrorDetails,
    lastAnalysisResult,
    setLastAnalysisResult,
    showDebugPanel,
    setShowDebugPanel,
    showProcessingMonitor,
    setShowProcessingMonitor
  } = useChatInterfaceState();

  console.log('=== DESIGN CHAT CONTAINER DEBUG ===');
  console.log('Storage status:', storageStatus);
  console.log('Storage error details:', storageErrorDetails);
  console.log('Attachments count:', attachments.length);

  const { 
    jobs, 
    systemHealth, 
    pauseJob, 
    resumeJob, 
    cancelJob 
  } = useImageProcessingMonitor();

  const {
    pendingImageProcessing,
    handleImageProcessed,
    handleImageProcessingError,
    handleFileDrop,
    handleRetryAttachment,
    handleClearAllAttachments
  } = useFileHandlers(storageStatus);

  const { addUrlAttachment, removeAttachment } = useAttachmentHandlers(
    attachments,
    setAttachments,
    setUrlInput,
    setShowUrlInput
  );

  const { 
    onSendMessage, 
    analyzeWithChat, 
    canSendMessage, 
    loadingState, 
    getStageMessage 
  } = useChatMessageHandlers(
    setMessages,
    setMessage,
    setAttachments,
    setLastAnalysisResult
  );

  // Configure dropzone without disabled property - handle disabled state in UI
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('=== DROPZONE FILE DROP ===');
      console.log('Files dropped:', acceptedFiles.length);
      console.log('Current storage status:', storageStatus);
      console.log('Is loading:', loadingState.isLoading);
      
      // Don't process files if loading or storage not ready
      if (loadingState.isLoading) {
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
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    noClick: loadingState.isLoading, // Disable click when loading
    noDrag: loadingState.isLoading // Disable drag when loading
  });

  const handleSuggestedPrompt = (prompt: string) => {
    if (!loadingState.isLoading) {
      setMessage(prompt);
    }
  };

  const retryAttachment = (id: string) => {
    if (!loadingState.isLoading) {
      handleRetryAttachment(attachments, setAttachments, id);
    }
  };

  const clearAllAttachments = () => {
    if (!loadingState.isLoading) {
      handleClearAllAttachments(setAttachments);
    }
  };

  const handleSendMessageWrapper = () => {
    console.log('=== SEND MESSAGE WRAPPER ===');
    console.log('Message length:', message.length);
    console.log('Attachments count:', attachments.length);
    console.log('Storage status:', storageStatus);
    
    onSendMessage(message, attachments);
  };

  const handleAddUrl = () => {
    if (!loadingState.isLoading) {
      addUrlAttachment(urlInput);
    }
  };

  const onImageProcessed = (attachmentId: string, processedFile: File, processingInfo: any) => {
    console.log('=== IMAGE PROCESSED CALLBACK ===');
    console.log('Attachment ID:', attachmentId);
    console.log('Processed file size:', processedFile.size);
    
    handleImageProcessed(attachments, setAttachments, attachmentId, processedFile, processingInfo);
  };

  const onImageProcessingError = (attachmentId: string, error: string) => {
    console.log('=== IMAGE PROCESSING ERROR CALLBACK ===');
    console.log('Attachment ID:', attachmentId);
    console.log('Error:', error);
    
    handleImageProcessingError(attachments, setAttachments, attachmentId, error);
  };

  return {
    // State
    message,
    attachments,
    messages,
    urlInput,
    showUrlInput,
    storageStatus,
    storageErrorDetails,
    lastAnalysisResult,
    showDebugPanel,
    showProcessingMonitor,
    pendingImageProcessing,
    jobs,
    systemHealth,
    loadingState,
    
    // State setters
    setMessage,
    setStorageStatus,
    setStorageErrorDetails,
    setShowUrlInput,
    setShowDebugPanel,
    setShowProcessingMonitor,
    
    // Handlers
    handleSuggestedPrompt,
    handleSendMessageWrapper,
    handleAddUrl,
    removeAttachment,
    retryAttachment,
    clearAllAttachments,
    onImageProcessed,
    onImageProcessingError,
    pauseJob,
    resumeJob,
    cancelJob,
    
    // Dropzone
    getRootProps,
    getInputProps,
    isDragActive,
    
    // Utilities
    canSendMessage: canSendMessage(message, attachments),
    isLoading: analyzeWithChat.isPending,
    getStageMessage,
    
    // URL handlers
    setUrlInput,
    onUrlInputChange: setUrlInput,
    onToggleUrlInput: () => !loadingState.isLoading && setShowUrlInput(!showUrlInput),
    onCancelUrl: () => setShowUrlInput(false)
  };
};
