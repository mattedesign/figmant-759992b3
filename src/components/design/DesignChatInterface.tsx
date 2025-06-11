
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { useDropzone } from 'react-dropzone';
import { Send, Upload, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { ChatMessage } from './chat/ChatMessage';
import { ChatAttachments } from './chat/ChatAttachments';
import { SuggestedPrompts } from './chat/SuggestedPrompts';
import { AnalysisResults } from './chat/AnalysisResults';
import { verifyStorageAccess } from '@/utils/storageUtils';
import { supabase } from '@/integrations/supabase/client';

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  status?: 'pending' | 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
}

interface ChatMessage {
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
      const result = await verifyStorageAccess();
      if (result.success) {
        setStorageStatus('ready');
      } else {
        setStorageStatus('error');
        toast({
          variant: "destructive",
          title: "Storage Configuration Issue",
          description: result.error || "Unable to access file storage. Please check your configuration.",
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

  const updateAttachmentStatus = (id: string, status: ChatAttachment['status'], errorMessage?: string) => {
    setAttachments(prev => prev.map(att => 
      att.id === id 
        ? { ...att, status, errorMessage }
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
          await uploadFileToStorage(attachment.file);
          updateAttachmentStatus(attachment.id, 'uploaded');
          
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

  // Show storage status indicator
  const renderStorageStatus = () => {
    if (storageStatus === 'checking') {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <span>Checking storage configuration...</span>
        </div>
      );
    }
    
    if (storageStatus === 'error') {
      return (
        <div className="flex items-center gap-2 text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <span>File uploads are currently unavailable. Please contact your administrator.</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
        <CheckCircle className="h-4 w-4" />
        <span>Ready for file uploads</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Interface */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Design Analysis Chat</CardTitle>
            {renderStorageStatus()}
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
            {storageStatus === 'ready' && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center mb-4 transition-colors cursor-pointer ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive 
                    ? 'Drop files here...' 
                    : 'Drag & drop images or PDFs, or click to select'
                  }
                </p>
              </div>
            )}

            {/* Attachments */}
            {attachments.length > 0 && (
              <ChatAttachments 
                attachments={attachments} 
                onRemove={removeAttachment} 
              />
            )}

            {/* URL Input */}
            {showUrlInput && (
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={(e) => e.key === 'Enter' && addUrlAttachment()}
                />
                <Button onClick={addUrlAttachment} size="sm">
                  Add
                </Button>
                <Button 
                  onClick={() => setShowUrlInput(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about your designs..."
                className="flex-1 min-h-[80px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  variant="outline"
                  size="icon"
                  title="Add website URL"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={(!message.trim() && attachments.length === 0) || analyzeWithChat.isPending}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <SuggestedPrompts onPromptClick={handleSuggestedPrompt} />
        
        {messages.length > 0 && (
          <AnalysisResults 
            messages={messages}
            onUploadMore={() => document.querySelector('input[type="file"]')?.click()}
          />
        )}
      </div>
    </div>
  );
};
