
import React, { ReactNode, useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatStateContext } from './ChatStateProvider';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

interface EnhancedChatMessageHandlerProps {
  children: (handlers: MessageHandlers) => ReactNode;
}

interface MessageHandlers {
  handleSendMessage: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleAddUrl: (url: string) => Promise<void>;
  handleFileUpload: (files: FileList) => Promise<void>;
  canSend: boolean;
  isProcessing: boolean;
}

export const EnhancedChatMessageHandler: React.FC<EnhancedChatMessageHandlerProps> = ({ children }) => {
  const {
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    analyzeWithClaude,
    getCurrentTemplate,
    isSessionInitialized,
    saveMessageAttachments,
    createContextualPrompt,
    toast
  } = useChatStateContext();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = useCallback(async (files: FileList) => {
    console.log('📁 ENHANCED MESSAGE HANDLER - Handling file upload:', files.length, 'files');
    
    const newAttachments: ChatAttachment[] = [];
    
    for (const file of Array.from(files)) {
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'uploading',
        file_size: file.size // FIX: Use file_size instead of size to match interface
      };
      newAttachments.push(attachment);
    }
    
    // Add files to attachments immediately for UI feedback
    setAttachments(prev => [...prev, ...newAttachments]);
    
    toast({
      title: "Files Added",
      description: `${newAttachments.length} file(s) added for analysis.`,
    });

    // Process uploads in background
    for (const attachment of newAttachments) {
      try {
        console.log('📤 Processing file upload for:', attachment.name);
        
        // Simulate upload processing (replace with actual Supabase upload)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update status to uploaded
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'uploaded', uploadPath: `uploads/${attachment.id}` }
            : att
        ));
        
        console.log('✅ File upload completed:', attachment.name);
        
      } catch (error) {
        console.error('❌ File upload failed:', error);
        
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'error' }
            : att
        ));
        
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${attachment.name}`,
        });
      }
    }
  }, [setAttachments, toast]);

  const handleAddUrl = useCallback(async (url: string) => {
    console.log('🔗 ENHANCED MESSAGE HANDLER - Adding URL:', url);
    
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL.",
      });
      return;
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      const urlObj = new URL(formattedUrl);
      const hostname = urlObj.hostname;

      // Check if URL already exists
      const urlExists = attachments.some(att => att.url === formattedUrl);
      if (urlExists) {
        toast({
          variant: "destructive",
          title: "URL Already Added",
          description: `${hostname} is already in your attachments.`,
        });
        return;
      }

      // Create new URL attachment
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: hostname,
        url: formattedUrl,
        status: 'processing',
        metadata: {
          screenshots: {
            desktop: { success: false, url: formattedUrl },
            mobile: { success: false, url: formattedUrl }
          }
        }
      };

      console.log('🔗 Creating URL attachment:', newAttachment);
      setAttachments(prev => [...prev, newAttachment]);
      
      toast({
        title: "Website Added",
        description: `${hostname} added. Capturing screenshots...`,
      });

      // Capture screenshots in background
      try {
        console.log('📸 Starting screenshot capture...');
        
        const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
          [formattedUrl],
          true, // desktop
          true  // mobile
        );

        console.log('📸 Screenshot results:', screenshotResults);

        // Update attachment with screenshots
        setAttachments(prev => prev.map(att => {
          if (att.id === newAttachment.id) {
            return {
              ...att,
              status: 'uploaded',
              metadata: {
                ...att.metadata,
                screenshots: {
                  desktop: screenshotResults.desktop?.[0] || { success: false, url: formattedUrl, error: 'Desktop screenshot failed' },
                  mobile: screenshotResults.mobile?.[0] || { success: false, url: formattedUrl, error: 'Mobile screenshot failed' }
                }
              }
            };
          }
          return att;
        }));

        const desktopSuccess = screenshotResults.desktop?.[0]?.success;
        const mobileSuccess = screenshotResults.mobile?.[0]?.success;

        if (desktopSuccess || mobileSuccess) {
          toast({
            title: "Screenshots Captured",
            description: `Successfully captured ${desktopSuccess && mobileSuccess ? 'desktop and mobile' : desktopSuccess ? 'desktop' : 'mobile'} screenshots.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Screenshot Capture Failed",
            description: `Unable to capture screenshots for ${hostname}. The website will still be analyzed.`,
          });
        }

      } catch (screenshotError) {
        console.error('📸 Screenshot error:', screenshotError);
        
        setAttachments(prev => prev.map(att => {
          if (att.id === newAttachment.id) {
            return {
              ...att,
              status: 'uploaded',
              metadata: {
                ...att.metadata,
                screenshots: {
                  desktop: { success: false, url: formattedUrl, error: 'Screenshot service unavailable' },
                  mobile: { success: false, url: formattedUrl, error: 'Screenshot service unavailable' }
                }
              }
            };
          }
          return att;
        }));

        toast({
          variant: "destructive",
          title: "Screenshot Capture Failed",
          description: `Screenshots unavailable for ${hostname}. The website will still be analyzed.`,
        });
      }

    } catch (error) {
      console.error('🔗 URL validation error:', error);
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
    }
  }, [attachments, setAttachments, toast]);

  const handleSendMessage = useCallback(async () => {
    console.log('🚀 ENHANCED MESSAGE HANDLER - Send message triggered');
    
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter a message or attach files/URLs.",
      });
      return;
    }

    // Check for processing attachments
    const processingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    
    if (processingAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Please Wait",
        description: "Some attachments are still processing. Please wait before sending.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('📝 Creating user message...');
      
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date(),
        attachments: attachments.length > 0 ? attachments : undefined
      };

      // Add user message to chat
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      // Save message attachments if session is initialized
      if (isSessionInitialized && userMessage.attachments) {
        saveMessageAttachments(userMessage);
      }

      // Clear input and attachments
      const currentMessage = message;
      const currentAttachments = [...attachments];
      setMessage('');
      setAttachments([]);

      console.log('🤖 Starting Claude analysis...');
      
      // Get current template
      const template = getCurrentTemplate();
      
      // Create contextual prompt
      const contextualPrompt = createContextualPrompt(currentMessage, template);
      
      // Prepare attachments for analysis
      const analysisAttachments = currentAttachments.map(att => ({
        id: att.id,
        type: att.type,
        name: att.name,
        uploadPath: att.uploadPath,
        url: att.url,
        metadata: att.metadata
      }));

      console.log('🎯 Sending to Claude with context:', {
        promptLength: contextualPrompt.length,
        attachmentsCount: analysisAttachments.length,
        hasTemplate: !!template
      });

      // Call Claude analysis
      const result = await analyzeWithClaude({
        message: contextualPrompt,
        attachments: analysisAttachments,
        template
      });

      console.log('✅ Claude analysis completed');

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Analysis Complete",
        description: "Your design analysis has been generated successfully.",
      });

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I apologize, but I encountered an error while analyzing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support if the issue persists.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    message, 
    attachments, 
    messages, 
    setMessages, 
    setMessage, 
    setAttachments, 
    analyzeWithClaude, 
    getCurrentTemplate, 
    createContextualPrompt,
    isSessionInitialized, 
    saveMessageAttachments, 
    toast
  ]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend && !isProcessing) {
        handleSendMessage();
      }
    }
  }, [handleSendMessage, isProcessing]);

  const canSend = !isProcessing && (
    message.trim().length > 0 || 
    (attachments.length > 0 && attachments.every(att => att.status === 'uploaded'))
  );

  const handlers: MessageHandlers = {
    handleSendMessage,
    handleKeyPress,
    handleAddUrl,
    handleFileUpload,
    canSend,
    isProcessing
  };

  return <>{children(handlers)}</>;
};
