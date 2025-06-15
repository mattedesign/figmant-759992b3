import { useDropzone } from 'react-dropzone';
import { useChatInterfaceState } from './useChatInterfaceState';
import { useAttachmentHandlers } from './useAttachmentHandlers';
import { useChatMessageHandlers } from './useChatMessageHandlers';
import { useFileHandlers } from '../handlers/useFileHandlers';
import { useImageProcessingMonitor } from '@/hooks/useImageProcessingMonitor';
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { verifyStorageSimplified, SimplifiedStorageResult } from '@/utils/storage/simplifiedStorageVerification';

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

  // --- Storage Verification Logic ---
  const { toast } = useToast();
  const { user, loading: authLoading, isOwner } = useAuth();
  const verificationAttempted = useRef(false);
  const mounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const performRoleAwareVerification = useCallback(async () => {
    if (verificationAttempted.current || authLoading || !mounted.current || storageStatus === 'ready') {
      return;
    }

    console.log('Forcing storage verification from useDesignChatLogic...');
    
    verificationAttempted.current = true;
    setStorageStatus('checking');
    setStorageErrorDetails(null);

    timeoutRef.current = setTimeout(() => {
      if (!mounted.current) return;
      
      console.warn('Storage verification timeout in useDesignChatLogic');
      setStorageStatus('error');
      setStorageErrorDetails({ 
        step: 'timeout', 
        error: 'Storage verification timed out',
        timeout: true 
      });
      
      if (user && isOwner) {
        toast({
          variant: "destructive",
          title: "Storage Verification Timeout",
          description: "Storage check took too long. Please try again.",
        });
      }
    }, 7000); // 7 second timeout
    
    try {
      const result: SimplifiedStorageResult = await verifyStorageSimplified();
      
      if (!mounted.current) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      console.log('Forced storage verification result:', result);
      
      if (result.success) {
        setStorageStatus('ready');
        setStorageErrorDetails(null);
        
        if (result.userRole === 'owner') {
          toast({
            title: "Storage Ready",
            description: "File uploads are configured and ready to use.",
          });
        }
      } else {
        setStorageStatus('error');
        setStorageErrorDetails(result.details);
        if (result.status === 'unavailable') {
          if (result.userRole === 'subscriber') {
            toast({
              title: "File Uploads Unavailable",
              description: "Contact your administrator if you need file upload access.",
            });
          }
        } else {
          if (result.userRole === 'owner') {
            toast({
              variant: "destructive",
              title: "Storage Configuration Issue",
              description: result.error || "Unable to access file storage.",
            });
          }
        }
      }
    } catch (error) {
      if (!mounted.current) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      console.error('Forced storage verification error:', error);
      setStorageStatus('error');
      setStorageErrorDetails({ step: 'logic_hook_error', error });
      
      if (user) {
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "An unexpected error occurred while checking storage access.",
        });
      }
    }
  }, [user, authLoading, isOwner, storageStatus, toast, setStorageStatus, setStorageErrorDetails]);

  useEffect(() => {
    verificationAttempted.current = false;
    const timeoutId = setTimeout(performRoleAwareVerification, 100);
    return () => clearTimeout(timeoutId);
  }, [user, authLoading, isOwner, performRoleAwareVerification]);
  // --- End Storage Verification Logic ---

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
  const { getRootProps: originalGetRootProps, getInputProps, isDragActive, open } = useDropzone({
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
    noClick: true, // Disable click when loading
    noDrag: loadingState.isLoading // Disable drag when loading
  });

  const getRootProps = (props?: any) => ({
    ...originalGetRootProps(props),
    open,
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
