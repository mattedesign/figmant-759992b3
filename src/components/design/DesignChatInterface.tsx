import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { useDropzone } from 'react-dropzone';
import { Send, Upload, Plus, AlertTriangle, CheckCircle, Bug, Activity } from 'lucide-react';
import { ChatMessage } from './chat/ChatMessage';
import { ChatAttachments } from './chat/ChatAttachments';
import { SuggestedPrompts } from './chat/SuggestedPrompts';
import { AnalysisResults } from './chat/AnalysisResults';
import { StorageStatus } from './chat/StorageStatus';
import { FileUploadDropzone } from './chat/FileUploadDropzone';
import { URLInput } from './chat/URLInput';
import { MessageInput } from './chat/MessageInput';
import { DebugPanel } from './chat/DebugPanel';
import { EnhancedImageUpload } from './chat/EnhancedImageUpload';
import { ProcessingMonitor } from './chat/ProcessingMonitor';
import { verifyStorageAccess } from '@/utils/storageUtils';
import { validateImageFile, ProcessedImage } from '@/utils/imageProcessing';
import { useImageProcessingMonitor } from '@/hooks/useImageProcessingMonitor';
import { supabase } from '@/integrations/supabase/client';

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
  status?: 'pending' | 'uploading' | 'uploaded' | 'error' | 'processing';
  errorMessage?: string;
  processingInfo?: ProcessedImage;
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
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showProcessingMonitor, setShowProcessingMonitor] = useState(false);
  const [pendingImageProcessing, setPendingImageProcessing] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const { analyzeWithChat } = useChatAnalysis();
  const { 
    jobs, 
    systemHealth, 
    pauseJob, 
    resumeJob, 
    cancelJob 
  } = useImageProcessingMonitor();

  // Check storage access on component mount
  React.useEffect(() => {
    const checkStorage = async () => {
      try {
        console.log('Starting storage verification...');
        const result = await verifyStorageAccess();
        
        if (result.success) {
          console.log('Storage verification successful');
          setStorageStatus('ready');
          toast({
            title: "Storage Ready",
            description: "File uploads are ready to use.",
          });
        } else {
          console.error('Storage verification failed:', result.error);
          setStorageStatus('error');
          toast({
            variant: "destructive",
            title: "Storage Configuration Issue",
            description: result.error || "Unable to access file storage. Please check your configuration.",
          });
        }
      } catch (error) {
        console.error('Storage verification error:', error);
        setStorageStatus('error');
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "An unexpected error occurred while checking storage access.",
        });
      }
    };
    
    checkStorage();
  }, [toast]);

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    console.log('Uploading file to storage:', { fileName, filePath, fileSize: file.size });

    const { error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded successfully:', filePath);
    return filePath;
  };

  const updateAttachmentStatus = (id: string, status: ChatAttachment['status'], errorMessage?: string, uploadPath?: string, processingInfo?: ProcessedImage) => {
    setAttachments(prev => prev.map(att => 
      att.id === id 
        ? { ...att, status, errorMessage, uploadPath, processingInfo }
        : att
    ));
  };

  const handleImageProcessed = async (attachmentId: string, processedFile: File, processingInfo: ProcessedImage) => {
    try {
      console.log('Image processed, uploading to storage:', {
        attachmentId,
        originalSize: processingInfo.originalSize,
        processedSize: processingInfo.processedSize,
        compressionRatio: processingInfo.compressionRatio
      });

      updateAttachmentStatus(attachmentId, 'uploading', undefined, undefined, processingInfo);

      const uploadPath = await uploadFileToStorage(processedFile);
      updateAttachmentStatus(attachmentId, 'uploaded', undefined, uploadPath, processingInfo);

      setPendingImageProcessing(prev => {
        const updated = new Set(prev);
        updated.delete(attachmentId);
        return updated;
      });

      toast({
        title: "Image Ready",
        description: processingInfo.compressionRatio > 0 
          ? `Image processed and uploaded (${processingInfo.compressionRatio}% compression)`
          : "Image uploaded successfully",
      });

    } catch (error) {
      console.error('Failed to upload processed image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      updateAttachmentStatus(attachmentId, 'error', errorMessage);
      
      setPendingImageProcessing(prev => {
        const updated = new Set(prev);
        updated.delete(attachmentId);
        return updated;
      });

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    }
  };

  const handleImageProcessingError = (attachmentId: string, error: string) => {
    console.error('Image processing failed:', { attachmentId, error });
    updateAttachmentStatus(attachmentId, 'error', error);
    
    setPendingImageProcessing(prev => {
      const updated = new Set(prev);
      updated.delete(attachmentId);
      return updated;
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (storageStatus !== 'ready') {
      toast({
        variant: "destructive",
        title: "Storage Not Ready",
        description: "File storage is not properly configured. Please check with your administrator.",
      });
      return;
    }

    const newAttachments: ChatAttachment[] = [];
    const imageFiles: File[] = [];
    const nonImageFiles: File[] = [];

    // Separate image and non-image files
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        imageFiles.push(file);
      } else {
        nonImageFiles.push(file);
      }
    });

    // Handle non-image files with traditional upload
    for (const file of nonImageFiles) {
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'pending'
      };

      newAttachments.push(attachment);

      try {
        updateAttachmentStatus(attachment.id, 'uploading');
        const uploadPath = await uploadFileToStorage(file);
        updateAttachmentStatus(attachment.id, 'uploaded', undefined, uploadPath);
        
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateAttachmentStatus(attachment.id, 'error', errorMessage);
        
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${errorMessage}`,
        });
      }
    }

    // Handle image files with enhanced processing
    for (const file of imageFiles) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Invalid Image",
          description: validation.error,
        });
        continue;
      }

      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'processing'
      };

      newAttachments.push(attachment);
      setPendingImageProcessing(prev => new Set(prev).add(attachment.id));
    }

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
    setPendingImageProcessing(prev => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    // Check if any attachments are still processing
    const processingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    if (processingAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload in Progress",
        description: "Please wait for all files to finish processing and uploading before sending.",
      });
      return;
    }

    // Check for failed uploads
    const failedAttachments = attachments.filter(att => att.status === 'error');
    if (failedAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload Errors",
        description: "Please remove or retry failed uploads before sending.",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    const currentAttachments = [...attachments];
    
    // Clear input
    setMessage('');
    setAttachments([]);

    try {
      const result = await analyzeWithChat.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments
      });

      // Store the analysis result for debugging
      setLastAnalysisResult(result);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
        uploadIds: result.uploadIds,
        batchId: result.batchId
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat analysis failed:', error);
      
      // Store the error for debugging
      setLastAnalysisResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your request. Please try again or check if your files uploaded correctly.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Interface */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Design Analysis Chat</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProcessingMonitor(!showProcessingMonitor)}
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  {showProcessingMonitor ? 'Hide' : 'Show'} Monitor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  {showDebugPanel ? 'Hide' : 'Show'} Debug
                </Button>
              </div>
            </div>
            <StorageStatus status={storageStatus} />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="mb-4">👋 Hi! I'm your UX analysis assistant.</p>
                  <p className="mb-4">Upload designs or share website URLs and ask me anything about:</p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm">
                    <Badge variant="outline">User Experience</Badge>
                    <Badge variant="outline">Conversion Optimization</Badge>
                    <Badge variant="outline">Visual Design</Badge>
                    <Badge variant="outline">Accessibility</Badge>
                    <Badge variant="outline">Performance</Badge>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))
              )}
            </div>

            {/* File Upload Area */}
            <FileUploadDropzone 
              storageStatus={storageStatus}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />

            {/* Enhanced Image Processing Display */}
            {attachments.filter(att => att.status === 'processing').map(attachment => (
              <EnhancedImageUpload
                key={attachment.id}
                file={attachment.file!}
                onProcessed={(processedFile, processingInfo) => 
                  handleImageProcessed(attachment.id, processedFile, processingInfo)
                }
                onError={(error) => handleImageProcessingError(attachment.id, error)}
              />
            ))}

            {/* Attachments */}
            {attachments.filter(att => att.status !== 'processing').length > 0 && (
              <ChatAttachments 
                attachments={attachments.filter(att => att.status !== 'processing')} 
                onRemove={removeAttachment} 
              />
            )}

            {/* URL Input */}
            <URLInput 
              showUrlInput={showUrlInput}
              urlInput={urlInput}
              onUrlInputChange={setUrlInput}
              onAddUrl={addUrlAttachment}
              onCancel={() => setShowUrlInput(false)}
            />

            {/* Message Input */}
            <MessageInput 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
              isLoading={analyzeWithChat.isPending}
              hasContent={message.trim().length > 0 || attachments.length > 0}
            />
          </CardContent>
        </Card>

        {/* Processing Monitor */}
        {showProcessingMonitor && (
          <ProcessingMonitor
            jobs={jobs}
            onPauseJob={pauseJob}
            onResumeJob={resumeJob}
            onCancelJob={cancelJob}
            systemHealth={systemHealth}
          />
        )}

        {/* Debug Panel */}
        <DebugPanel 
          attachments={attachments}
          lastAnalysisResult={lastAnalysisResult}
          isVisible={showDebugPanel}
        />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <SuggestedPrompts onSelectPrompt={handleSuggestedPrompt} />
        
        {messages.length > 0 && (
          <AnalysisResults />
        )}
      </div>
    </div>
  );
};
