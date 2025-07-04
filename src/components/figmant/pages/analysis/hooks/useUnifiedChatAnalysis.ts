import { useState, useCallback } from 'react';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useChatState } from '../ChatStateManager';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

export const useUnifiedChatAnalysis = () => {
  const { data: templates = [], isLoading: templatesLoading } = useFigmantPromptTemplates();
  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysis();
  const { toast } = useToast();
  
  const chatState = useChatState();
  const {
    messages = [],
    setMessages,
    message = '',
    setMessage,
    attachments = [],
    setAttachments,
    selectedTemplateId,
    setSelectedTemplateId
  } = chatState;

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);

  const getCurrentTemplate = useCallback(() => {
    return templates.find(t => t.id === selectedTemplateId) || null;
  }, [templates, selectedTemplateId]);

  const handleFileUpload = useCallback(async (files: FileList) => {
    const newAttachments: ChatAttachment[] = [];
    
    for (const file of Array.from(files)) {
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'uploading'
      };
      newAttachments.push(attachment);
    }
    
    if (setAttachments) {
      setAttachments(prev => {
        const updated = [...prev, ...newAttachments];
        console.log('📎 File attachments updated:', updated.length);
        return updated;
      });
    }
    
    toast({
      title: "Files Added",
      description: `${newAttachments.length} file(s) added for analysis.`,
    });

    // Process file uploads in background
    for (const attachment of newAttachments) {
      try {
        console.log('📤 Starting file upload for:', attachment.name);
        
        // Simulate file upload processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update attachment status to uploaded
        if (setAttachments) {
          setAttachments(prev => prev.map(att => 
            att.id === attachment.id 
              ? { ...att, status: 'uploaded', uploadPath: `uploads/${attachment.id}` }
              : att
          ));
        }
        
        console.log('📤 File upload completed for:', attachment.name);
        
      } catch (error) {
        console.error('📤 File upload failed:', error);
        
        // Update attachment status to error
        if (setAttachments) {
          setAttachments(prev => prev.map(att => 
            att.id === attachment.id 
              ? { ...att, status: 'error' }
              : att
          ));
        }
      }
    }
  }, [setAttachments, toast]);

  const handleAddUrl = useCallback(async () => {
    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL.",
      });
      return;
    }

    console.log('🔗 UNIFIED CHAT - Adding URL:', urlInput);

    // Validate URL format
    let formattedUrl = urlInput.trim();
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

      // Create new URL attachment with processing status
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

      console.log('🔗 Creating new URL attachment:', newAttachment);
      
      // Update attachments state immediately
      if (setAttachments) {
        setAttachments(prev => {
          const updated = [...prev, newAttachment];
          console.log('🔗 URL attachments updated, new count:', updated.length);
          return updated;
        });
      }
      
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "Website Added",
        description: `${hostname} has been added. Capturing screenshots...`,
      });

      // Capture screenshots in the background
      try {
        console.log('📸 Starting screenshot capture for:', formattedUrl);
        
        const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
          [formattedUrl],
          true, // include desktop
          true  // include mobile
        );

        console.log('📸 Screenshot capture results:', screenshotResults);

        // Update the attachment with screenshot data
        if (setAttachments) {
          setAttachments(prev => prev.map(att => {
            if (att.id === newAttachment.id) {
              const updatedAtt = {
                ...att,
                status: 'uploaded' as const,
                metadata: {
                  ...att.metadata,
                  screenshots: {
                    desktop: screenshotResults.desktop?.[0] || { success: false, url: formattedUrl, error: 'Desktop screenshot failed' },
                    mobile: screenshotResults.mobile?.[0] || { success: false, url: formattedUrl, error: 'Mobile screenshot failed' }
                  }
                }
              };
              console.log('📸 Updated attachment with screenshots:', updatedAtt);
              return updatedAtt;
            }
            return att;
          }));
        }

        const desktopSuccess = screenshotResults.desktop?.[0]?.success;
        const mobileSuccess = screenshotResults.mobile?.[0]?.success;

        if (desktopSuccess || mobileSuccess) {
          toast({
            title: "Screenshots Captured",
            description: `Successfully captured ${desktopSuccess && mobileSuccess ? 'desktop and mobile' : desktopSuccess ? 'desktop' : 'mobile'} screenshots for ${hostname}.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Screenshot Capture Failed",
            description: `Unable to capture screenshots for ${hostname}. The website will still be analyzed.`,
          });
        }

      } catch (screenshotError) {
        console.error('📸 Screenshot capture error:', screenshotError);
        
        // Update attachment status to show error but keep it functional
        if (setAttachments) {
          setAttachments(prev => prev.map(att => {
            if (att.id === newAttachment.id) {
              return {
                ...att,
                status: 'uploaded' as const,
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
        }

        toast({
          variant: "destructive",
          title: "Screenshot Capture Failed",
          description: `Unable to capture screenshots for ${hostname}. The website will still be analyzed.`,
        });
      }

    } catch (error) {
      console.error('URL validation error:', error);
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
    }
  }, [urlInput, attachments, setAttachments, toast]);

  const removeAttachment = useCallback((id: string) => {
    if (setAttachments) {
      setAttachments(prev => {
        const updated = prev.filter(att => att.id !== id);
        console.log('🗑️ Attachment removed, new count:', updated.length);
        return updated;
      });
    }
  }, [setAttachments]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    if (setSelectedTemplateId) {
      setSelectedTemplateId(templateId);
    }
  }, [setSelectedTemplateId]);

  const handleViewTemplate = useCallback((template: any) => {
    console.log('🎯 UNIFIED CHAT - View template:', template);
    // This would open a modal or details view
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter a message or attach files/URLs.",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    const newMessages = [...messages, userMessage];
    if (setMessages) setMessages(newMessages);
    if (setMessage) setMessage('');

    try {
      const template = getCurrentTemplate();
      
      const analysisAttachments = attachments.map(att => ({
        id: att.id,
        type: att.type,
        name: att.name,
        uploadPath: att.uploadPath,
        url: att.url
      }));

      const result = await analyzeWithClaude({
        message,
        attachments: analysisAttachments,
        template
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      if (setMessages) {
        setMessages(prev => [...prev, assistantMessage]);
      }

      // Store the analysis result
      setLastAnalysisResult(result);

      // Clear attachments after successful analysis
      if (setAttachments) {
        setAttachments([]);
      }

    } catch (error) {
      console.error('Analysis error:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      if (setMessages) {
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  }, [message, attachments, messages, setMessages, setMessage, setAttachments, analyzeWithClaude, getCurrentTemplate, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const canSend = !isAnalyzing && (
    message.trim().length > 0 || 
    (attachments.length > 0 && attachments.every(att => att.status === 'uploaded'))
  );

  console.log('🔄 UNIFIED CHAT ANALYSIS - Current state:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    urlInput,
    showUrlInput
  });

  return {
    // State
    messages,
    message,
    setMessage,
    attachments,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    
    // Templates
    templates,
    templatesLoading,
    selectedTemplateId,
    setSelectedTemplateId,
    getCurrentTemplate,
    figmantTemplates: templates,
    
    // Handlers
    handleFileUpload,
    handleAddUrl,
    handleSendMessage,
    handleKeyPress,
    removeAttachment,
    handleTemplateSelect,
    handleViewTemplate,
    
    // Status
    isAnalyzing,
    canSend,
    lastAnalysisResult
  };
};
