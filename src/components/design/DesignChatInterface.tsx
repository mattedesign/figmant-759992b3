
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
  Plus,
  Camera,
  Video,
  Mic,
  ChevronDown
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
  mode?: 'chat' | 'analyze';
}

interface DesignChatInterfaceProps {
  onSendMessage: (message: string, attachments: ChatAttachment[]) => void;
  messages: ChatMessage[];
  isProcessing?: boolean;
  placeholder?: string;
  className?: string;
  // New props for the modern interface
  showAttachmentMenu?: boolean;
  setShowAttachmentMenu?: (show: boolean) => void;
  showTemplateMenu?: boolean;
  setShowTemplateMenu?: (show: boolean) => void;
  showModeMenu?: boolean;
  setShowModeMenu?: (show: boolean) => void;
  chatMode?: 'chat' | 'analyze';
  setChatMode?: (mode: 'chat' | 'analyze') => void;
  figmantTemplates?: any[];
  getCurrentTemplate?: () => any;
  handleTemplateSelect?: (templateId: string) => void;
  onToggleUrlInput?: () => void;
}

export const DesignChatInterface: React.FC<DesignChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isProcessing = false,
  placeholder = "How can I help...",
  className = "",
  showAttachmentMenu = false,
  setShowAttachmentMenu = () => {},
  showTemplateMenu = false,
  setShowTemplateMenu = () => {},
  showModeMenu = false,
  setShowModeMenu = () => {},
  chatMode = 'chat',
  setChatMode = () => {},
  figmantTemplates = [],
  getCurrentTemplate = () => null,
  handleTemplateSelect = () => {},
  onToggleUrlInput = () => {}
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

  const canSendMessage = (message.trim().length > 0 || attachments.length > 0) && !isProcessing;

  const handleAttachmentAction = (type: 'screenshot' | 'link' | 'camera') => {
    setShowAttachmentMenu(false);
    switch (type) {
      case 'screenshot':
        // Trigger existing screenshot functionality
        document.getElementById('file-upload')?.click();
        break;
      case 'link':
        onToggleUrlInput();
        setShowUrlInput(true);
        break;
      case 'camera':
        // Trigger camera functionality
        document.getElementById('file-upload')?.click();
        break;
    }
  };

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

      {/* Modern Chat Interface Container */}
      <div className="flex flex-col items-start gap-6 p-3 rounded-3xl border border-[#ECECEC] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13),0px_2px_0px_0px_#FFF_inset,0px_8px_16px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md lg:gap-6 md:gap-4 sm:gap-3 sm:p-2">
        
        {/* TEXT INPUT AREA */}
        <div className="flex p-2 items-start gap-2 self-stretch">
          <textarea
            className="flex-1 overflow-hidden text-[#121212] text-ellipsis font-['Instrument_Sans'] text-[15px] font-normal leading-6 tracking-[-0.3px] border-none outline-none bg-transparent resize-none"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 8,
            }}
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />
        </div>

        {/* ACTIONS BAR */}
        <div className="flex justify-between items-center self-stretch sm:flex-col sm:gap-3 sm:items-stretch">
          
          {/* LEFT SIDE CONTROLS */}
          <div className="flex items-center gap-3 sm:justify-between sm:w-full">
            
            {/* EXPANDABLE PLUS BUTTON */}
            <div className="relative">
              <button 
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="flex h-10 px-[10px] py-1 items-center gap-3 rounded-xl border border-[#E2E2E2] hover:bg-gray-50 transition-colors sm:h-12 sm:px-3"
                disabled={isProcessing}
              >
                <Plus className="w-4 h-4" />
              </button>
              
              {showAttachmentMenu && (
                <div className="absolute bottom-full left-0 mb-2 flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-20">
                  <button 
                    onClick={() => handleAttachmentAction('screenshot')}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Add Screenshots</span>
                  </button>
                  <button 
                    onClick={() => handleAttachmentAction('link')}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Add A Link</span>
                  </button>
                  <button 
                    onClick={() => handleAttachmentAction('camera')}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Use Camera</span>
                  </button>
                </div>
              )}
            </div>

            {/* TEMPLATE DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="flex h-10 px-[10px] py-1 items-center gap-3 rounded-xl border border-[#E2E2E2] hover:bg-gray-50 transition-colors sm:h-12 sm:px-3"
                disabled={isProcessing}
              >
                <div className="flex p-[2px] items-center gap-2 w-4 h-4">
                  <span className="text-lg">⚡</span>
                </div>
                <span className="text-[#121212] font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px]">
                  {getCurrentTemplate()?.displayName || 'Template Name'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showTemplateMenu && (
                <div className="absolute top-full left-0 mt-2 min-w-[200px] flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-20">
                  {figmantTemplates.map((template) => (
                    <button 
                      key={template.id}
                      onClick={() => {
                        handleTemplateSelect(template.id);
                        setShowTemplateMenu(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-lg">⚡</span>
                      <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">
                        {template.displayName || template.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MODE SELECTOR */}
            <div className="relative">
              <button 
                onClick={() => setShowModeMenu(!showModeMenu)}
                className="flex px-3 py-[10px] items-center gap-3 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">
                  {chatMode === 'chat' ? 'Chat' : 'Analyse'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showModeMenu && (
                <div className="absolute top-full right-0 mt-2 flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-20">
                  <button 
                    onClick={() => { setChatMode('chat'); setShowModeMenu(false); }}
                    className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-['Instrument_Sans'] text-[14px] font-medium">Chat</span>
                    <p className="font-['Instrument_Sans'] text-[12px] text-gray-600">Ask questions or interact without getting an analysis</p>
                  </button>
                  <button 
                    onClick={() => { setChatMode('analyze'); setShowModeMenu(false); }}
                    className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-['Instrument_Sans'] text-[14px] font-medium">Analyse</span>
                    <p className="font-['Instrument_Sans'] text-[12px] text-gray-600">Get analysis on your files or content provided</p>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* RIGHT SIDE CONTROLS */}
          <div className="flex items-center gap-3 sm:justify-center">
            {/* MICROPHONE BUTTON */}
            <button 
              className="flex h-10 px-[10px] py-1 items-center gap-3 rounded-xl hover:bg-gray-50 transition-colors sm:h-12 sm:px-3"
              disabled={isProcessing}
            >
              <Mic className="w-5 h-5 text-[#7B7B7B]" />
            </button>
            
            {/* SUBMIT BUTTON */}
            <button 
              onClick={handleSendMessage}
              disabled={!canSendMessage}
              className="flex w-10 h-10 px-8 py-3 justify-center items-center gap-2 rounded-xl bg-gradient-to-b from-[#E5E5E5] to-[#E2E2E2] shadow-[0px_3px_4px_-1px_rgba(0,0,0,0.15),0px_1px_0px_0px_rgba(255,255,255,0.33)_inset,0px_0px_0px_1px_#D4D4D4] hover:from-[#E0E0E0] hover:to-[#DDDDDD] transition-all disabled:opacity-50 sm:w-12 sm:h-12"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 text-[#121212] flex-shrink-0 animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-[#121212] flex-shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
        id="file-upload"
        accept="image/*,.pdf,.txt,.md"
      />
    </div>
  );
};
