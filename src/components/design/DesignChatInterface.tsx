
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { useDropzone } from 'react-dropzone';
import { Send, Upload, Plus, AlertTriangle, CheckCircle, Bug } from 'lucide-react';
import { ChatMessage } from './chat/ChatMessage';
import { ChatAttachments } from './chat/ChatAttachments';
import { SuggestedPrompts } from './chat/SuggestedPrompts';
import { AnalysisResults } from './chat/AnalysisResults';
import { StorageStatus } from './chat/StorageStatus';
import { FileUploadDropzone } from './chat/FileUploadDropzone';
import { URLInput } from './chat/URLInput';
import { MessageInput } from './chat/MessageInput';
import { DebugPanel } from './chat/DebugPanel';
import { verifyStorageAccess } from '@/utils/storageUtils';
import { supabase } from '@/integrations/supabase/client';

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
  status?: 'pending' | 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
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
  
  const { toast } = useToast();
  const { analyzeWithChat } = useChatAnalysis();

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

  const updateAttachmentStatus = (id: string, status: ChatAttachment['status'], errorMessage?: string, uploadPath?: string) => {
    setAttachments(prev => prev.map(att => 
      att.id === id 
        ? { ...att, status, errorMessage, uploadPath }
        : att
    ));
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

    const newAttachments: ChatAttachment[] = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      type: 'file',
      name: file.name,
      file,
      status: 'pending'
    }));

    setAttachments(prev => [...prev, ...newAttachments]);

    // Upload files one by one with proper error handling
    for (const attachment of newAttachments) {
      try {
        updateAttachmentStatus(attachment.id, 'uploading');
        
        if (attachment.file) {
          const uploadPath = await uploadFileToStorage(attachment.file);
          updateAttachmentStatus(attachment.id, 'uploaded', undefined, uploadPath);
          
          toast({
            title: "File Uploaded",
            description: `${attachment.name} has been uploaded successfully.`,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateAttachmentStatus(attachment.id, 'error', errorMessage);
        
        console.error('File upload failed:', error);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${attachment.name}: ${errorMessage}`,
        });
      }
    }
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
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    // Check if any attachments are still uploading
    const uploadingAttachments = attachments.filter(att => att.status === 'uploading');
    if (uploadingAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload in Progress",
        description: "Please wait for all files to finish uploading before sending.",
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
            <CardTitle>Design Analysis Chat</CardTitle>
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

            {/* Attachments */}
            {attachments.length > 0 && (
              <ChatAttachments 
                attachments={attachments} 
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
