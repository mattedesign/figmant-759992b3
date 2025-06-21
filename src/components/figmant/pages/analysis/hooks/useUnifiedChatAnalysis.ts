import { useState, useCallback } from 'react';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useChatState } from '../ChatStateManager';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { convertToLegacyAttachments } from '@/utils/attachmentTypeConverter';
import { useAuth } from '@/contexts/AuthContext';

export const useUnifiedChatAnalysis = () => {
  const { data: templates = [], isLoading: templatesLoading } = useFigmantPromptTemplates();
  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysis();
  const { toast } = useToast();
  const { user } = useAuth(); // Get current authenticated user
  
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
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to upload files.",
      });
      return;
    }

    const newAttachments: ChatAttachment[] = [];
    
    for (const file of Array.from(files)) {
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
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
  }, [setAttachments, toast, user]);

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
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to send messages.",
      });
      return;
    }

    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter a message or attach files/URLs.",
      });
      return;
    }

    console.log('🔄 UNIFIED CHAT - Sending message for user:', user.email);

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
      
      // Convert attachments to legacy format for API compatibility
      const legacyAttachments = convertToLegacyAttachments(attachments);

      console.log('🔄 UNIFIED CHAT - Calling analysis for user:', user.id);
      
      const result = await analyzeWithClaude({
        message,
        attachments: legacyAttachments,
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
      console.error('Analysis error for user', user.email, ':', error);
      
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
  }, [message, attachments, messages, setMessages, setMessage, setAttachments, analyzeWithClaude, getCurrentTemplate, toast, user]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const canSend = !isAnalyzing && (message.trim().length > 0 || attachments.length > 0) && !!user;

  console.log('🔄 UNIFIED CHAT ANALYSIS - Current state:', {
    userId: user?.id,
    userEmail: user?.email,
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
