import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, Upload, Link, X, Image, FileText, Globe, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { ScreenshotResult } from '@/services/screenshot/types';

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url' | 'image';
  name: string;
  url?: string;
  file?: File;
  status: 'pending' | 'uploading' | 'uploaded' | 'processing' | 'error';
  uploadPath?: string;
  error?: string;
  errorMessage?: string;
  processingInfo?: any;
  metadata?: {
    screenshots?: {
      desktop?: ScreenshotResult;
      mobile?: ScreenshotResult;
    };
    size?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatAttachment[];
  timestamp: Date;
  uploadIds?: string[];
  batchId?: string;
  mode?: 'chat' | 'analyze';
}

interface DesignChatInterfaceProps {
  onSendMessage: (message: string, attachments: ChatAttachment[]) => void;
  onClearChat?: () => void;
  messages: ChatMessage[];
  isAnalyzing?: boolean;
  isProcessing?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DesignChatInterface: React.FC<DesignChatInterfaceProps> = ({
  onSendMessage,
  onClearChat,
  messages,
  isAnalyzing = false,
  isProcessing = false,
  placeholder = "Describe your design or ask for analysis...",
  disabled = false,
  className = ""
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = useCallback(async (files: File[]) => {
    const maxFileSize = 10 * 1024 * 1024; // 10MB limit
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    
    const validFiles = [];
    const invalidFiles = [];
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (too large - max 10MB)`);
        continue;
      }
      
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (unsupported type)`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Some files were rejected",
        description: invalidFiles.join(', '),
      });
    }
    
    if (validFiles.length === 0) return;

    const newAttachments: ChatAttachment[] = validFiles.map(file => ({
      id: crypto.randomUUID(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      file,
      status: 'uploading',
      metadata: {
        size: file.size
      }
    }));

    setAttachments(prev => [...prev, ...newAttachments]);

    // Process uploads with proper error handling
    for (const attachment of newAttachments) {
      try {
        // Simulate upload process (replace with actual upload logic)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const uploadPath = `uploads/${attachment.id}/${attachment.name}`;
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'uploaded', uploadPath }
            : att
        ));
        
        toast({
          title: "File uploaded",
          description: `${attachment.name} is ready for analysis.`,
        });
        
      } catch (error) {
        console.error('Upload failed for:', attachment.name, error);
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { 
                ...att, 
                status: 'error', 
                error: 'Upload failed',
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
              }
            : att
        ));
        
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: `Failed to upload ${attachment.name}. Please try again.`,
        });
      }
    }
  }, [toast]);

  const handleUrlAdd = useCallback(() => {
    if (!urlInput.trim()) return;

    try {
      // Better URL validation
      let formattedUrl = urlInput.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      const url = new URL(formattedUrl);
      
      // Check for duplicate URLs
      const isDuplicate = attachments.some(att => att.url === url.href);
      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "URL Already Added",
          description: "This URL is already in your attachments.",
        });
        return;
      }
      
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: url.hostname,
        url: url.href,
        status: 'uploaded'
      };

      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "Website Added",
        description: `${url.hostname} has been added for analysis.`,
      });
      
    } catch (error) {
      console.error('URL validation failed:', error);
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., example.com or https://example.com)",
      });
    }
  }, [urlInput, attachments, toast]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }, []);

  const handleSend = useCallback(() => {
    if (!message.trim() && attachments.length === 0) return;
    
    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  }, [message, attachments, onSendMessage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    noClick: true
  });

  const getAttachmentIcon = (attachment: ChatAttachment) => {
    switch (attachment.type) {
      case 'url':
        return <Globe className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'file':
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: ChatAttachment['status']) => {
    switch (status) {
      case 'pending':
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'uploaded':
        return <CheckCircle className="h-3 w-3" />;
      case 'error':
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden ${className}`}>
      {/* Messages Area - Scrollable with proper constraints */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {msg.content}
              </div>
              
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className={`flex items-center gap-2 p-2 rounded ${
                        msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      {getAttachmentIcon(attachment)}
                      <span className="text-xs truncate">
                        {attachment.name || attachment.url}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={`text-xs mt-2 ${
                msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {(isAnalyzing || isProcessing) && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Analyzing your design...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom with constraints */}
      <div className="flex-shrink-0 border-t p-4" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {/* URL Input */}
        {showUrlInput && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter website URL..."
                className="flex-1 px-3 py-2 border rounded"
                onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
              />
              <Button onClick={handleUrlAdd} size="sm">
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

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
              >
                {getAttachmentIcon(attachment)}
                <span className="flex-1 text-sm truncate">
                  {attachment.name}
                </span>
                {attachment.metadata?.size && (
                  <span className="text-xs text-gray-500">
                    {(attachment.metadata.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {getStatusIcon(attachment.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                {attachment.status === 'error' && attachment.errorMessage && (
                  <div className="text-xs text-red-600 mt-1">
                    {attachment.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Drag & Drop Overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Drop files here to upload</p>
            </div>
          </div>
        )}

        {/* Input Controls - Fixed height container */}
        <div className="flex items-end gap-3 min-h-[60px]">
          {/* Attachment Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
              disabled={disabled || isAnalyzing || isProcessing}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={disabled || isAnalyzing || isProcessing}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              disabled={disabled || isAnalyzing || isProcessing}
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>

          {/* Text Input */}
          <div className="flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              className="min-h-[60px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={disabled || isAnalyzing || isProcessing}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={(!message.trim() && attachments.length === 0) || disabled || isAnalyzing || isProcessing}
            size="sm"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Clear Chat Button */}
        {onClearChat && messages.length > 0 && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearChat}
              disabled={disabled || isAnalyzing || isProcessing}
            >
              Clear Chat
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
