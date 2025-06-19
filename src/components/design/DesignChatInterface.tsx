import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Paperclip, 
  X, 
  Upload, 
  File, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle,
  Globe,
  Plus
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';

export interface ScreenshotResult {
  success: boolean;
  url: string;
  screenshotUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
    capturedAt: string;
    deviceType: 'desktop' | 'mobile';
  };
}

export interface ProcessedImage {
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  width?: number;
  height?: number;
}

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
  status: 'pending' | 'processing' | 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
  processingInfo?: ProcessedImage;
  metadata?: {
    screenshots?: {
      desktop?: ScreenshotResult;
      mobile?: ScreenshotResult;
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatAttachment[];
  timestamp: Date;
  batchId?: string;
  uploadIds?: string[];
}

interface DesignChatInterfaceProps {
  onSendMessage: (message: string, attachments: ChatAttachment[]) => void;
  messages: ChatMessage[];
  isProcessing?: boolean;
  placeholder?: string;
  className?: string;
}

export const DesignChatInterface: React.FC<DesignChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  placeholder = "Describe your design or ask for analysis...",
  className = ""
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const attachmentId = crypto.randomUUID();
      
      // Add file with processing status
      const newAttachment: ChatAttachment = {
        id: attachmentId,
        type: 'file',
        name: file.name,
        file: file,
        status: 'processing'
      };

      setAttachments(prev => [...prev, newAttachment]);

      try {
        // Upload to Supabase storage
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `chat-uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('design-uploads')
          .upload(fileName, file);

        if (error) throw error;

        // Update attachment with upload path
        setAttachments(prev => prev.map(att => 
          att.id === attachmentId 
            ? { ...att, uploadPath: data.path, status: 'uploaded' }
            : att
        ));

        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });

      } catch (error) {
        console.error('Upload error:', error);
        setAttachments(prev => prev.map(att => 
          att.id === attachmentId 
            ? { ...att, status: 'error', errorMessage: error instanceof Error ? error.message : 'Upload failed' }
            : att
        ));

        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
        });
      }
    }
  }, [toast]);

  const handleAddUrl = useCallback(() => {
    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL.",
      });
      return;
    }

    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      const urlObj = new URL(formattedUrl);
      const hostname = urlObj.hostname;

      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: hostname,
        url: formattedUrl,
        status: 'uploaded'
      };

      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: `${hostname} has been added to your message`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
    }
  }, [urlInput, toast]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please enter a message or attach files before sending.",
      });
      return;
    }

    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  }, [message, attachments, onSendMessage, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const fileList = new DataTransfer();
    acceptedFiles.forEach(file => fileList.items.add(file));
    handleFileUpload(fileList.files);
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md']
    }
  });

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !isProcessing;

  return (
    <div className={`flex flex-col h-full ${className}`} {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Design Analysis</h3>
            <p className="text-gray-500 max-w-md">
              Upload your design files, add website URLs, or describe what you'd like to analyze. 
              I'll provide detailed insights and suggestions.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-2 space-y-1">
                  {msg.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-2 text-xs opacity-75">
                      {attachment.type === 'file' ? (
                        <File className="w-3 h-3" />
                      ) : (
                        <Globe className="w-3 h-3" />
                      )}
                      <span className="truncate">{attachment.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {attachment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              {msg.content && (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
              
              <div className="text-xs opacity-50 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">Analyzing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Drag Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-700 font-medium">Drop files here to upload</p>
          </div>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="border-t bg-gray-50 p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Attachments ({attachments.length})
          </div>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between bg-white p-2 rounded border">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {attachment.type === 'file' ? (
                    <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                  <span className="text-sm truncate">{attachment.name}</span>
                  <Badge 
                    variant={attachment.status === 'uploaded' ? 'default' : 
                            attachment.status === 'error' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {attachment.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <div className="border-t bg-gray-50 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddUrl();
                }
              }}
              autoFocus
            />
            <Button onClick={handleAddUrl} size="sm">
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
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="resize-none min-h-[60px]"
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              accept="image/*,.pdf,.txt,.md"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isProcessing}
              className="h-9 w-9 p-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(true)}
              disabled={isProcessing}
              className="h-9 w-9 p-0"
            >
              <Globe className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!canSend}
              className="h-9 w-9 p-0"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
