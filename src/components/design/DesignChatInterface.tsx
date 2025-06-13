import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { ChatContainer } from './chat/ChatContainer';
import { ChatSidebar } from './chat/ChatSidebar';
import { useFileHandlers } from './chat/handlers/useFileHandlers';
import { useMessageHandlers } from './chat/MessageHandlers';
import { useImageProcessingMonitor } from '@/hooks/useImageProcessingMonitor';
import { verifyStorageAccess } from '@/utils/storage/storageVerification';

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
  status?: 'pending' | 'uploading' | 'uploaded' | 'error' | 'processing';
  errorMessage?: string;
  processingInfo?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  uploadIds?: string[];
  batchId?: string;
}

export const DesignChatInterface = () => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [storageErrorDetails, setStorageErrorDetails] = useState<any>(null);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showProcessingMonitor, setShowProcessingMonitor] = useState(false);
  
  const { toast } = useToast();
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
    handleClearAllAttachments,
    updateAttachmentStatus
  } = useFileHandlers(storageStatus);

  const { handleSendMessage, analyzeWithChat } = useMessageHandlers();

  // Enhanced storage verification on component mount
  React.useEffect(() => {
    const checkStorage = async () => {
      try {
        console.log('Starting enhanced storage verification...');
        setStorageStatus('checking');
        setStorageErrorDetails(null);
        
        const result = await verifyStorageAccess();
        
        if (result.success) {
          console.log('Storage verification successful');
          setStorageStatus('ready');
          setStorageErrorDetails(null);
          
          toast({
            title: "Storage Ready",
            description: "File uploads are ready to use.",
          });
        } else {
          console.error('Storage verification failed:', result);
          setStorageStatus('error');
          setStorageErrorDetails(result.details);
          
          toast({
            variant: "destructive",
            title: "Storage Configuration Issue",
            description: result.error || "Unable to access file storage.",
          });
        }
      } catch (error) {
        console.error('Storage verification error:', error);
        setStorageStatus('error');
        setStorageErrorDetails({ step: 'catch', error });
        
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "An unexpected error occurred while checking storage access.",
        });
      }
    };
    
    checkStorage();
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, attachments, setAttachments),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: storageStatus !== 'ready'
  });

  const addUrlAttachment = () => {
    if (urlInput.trim()) {
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: new URL(urlInput).hostname,
        url: urlInput.trim(),
        status: 'uploaded'
      };
      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: `Website ${newAttachment.name} has been added for analysis.`,
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const retryAttachment = (id: string) => {
    handleRetryAttachment(attachments, setAttachments, id);
  };

  const clearAllAttachments = () => {
    handleClearAllAttachments(setAttachments);
  };

  const onSendMessage = () => {
    handleSendMessage(
      message,
      attachments,
      setMessages,
      setMessage,
      setAttachments,
      setLastAnalysisResult
    );
  };

  const onImageProcessed = (attachmentId: string, processedFile: File, processingInfo: any) => {
    handleImageProcessed(attachments, setAttachments, attachmentId, processedFile, processingInfo);
  };

  const onImageProcessingError = (attachmentId: string, error: string) => {
    handleImageProcessingError(attachments, setAttachments, attachmentId, error);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      <ChatContainer
        messages={messages}
        attachments={attachments}
        message={message}
        urlInput={urlInput}
        showUrlInput={showUrlInput}
        storageStatus={storageStatus}
        storageErrorDetails={storageErrorDetails}
        showDebugPanel={showDebugPanel}
        showProcessingMonitor={showProcessingMonitor}
        lastAnalysisResult={lastAnalysisResult}
        pendingImageProcessing={pendingImageProcessing}
        jobs={jobs}
        systemHealth={systemHealth}
        onMessageChange={setMessage}
        onSendMessage={onSendMessage}
        onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
        onUrlInputChange={setUrlInput}
        onAddUrl={addUrlAttachment}
        onCancelUrl={() => setShowUrlInput(false)}
        onRemoveAttachment={removeAttachment}
        onRetryAttachment={retryAttachment}
        onClearAllAttachments={clearAllAttachments}
        onImageProcessed={onImageProcessed}
        onImageProcessingError={onImageProcessingError}
        onToggleDebugPanel={() => setShowDebugPanel(!showDebugPanel)}
        onToggleProcessingMonitor={() => setShowProcessingMonitor(!showProcessingMonitor)}
        onStorageStatusChange={setStorageStatus}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        isLoading={analyzeWithChat.isPending}
        pauseJob={pauseJob}
        resumeJob={resumeJob}
        cancelJob={cancelJob}
      />

      <ChatSidebar
        messages={messages}
        onSelectPrompt={handleSuggestedPrompt}
      />
    </div>
  );
};
