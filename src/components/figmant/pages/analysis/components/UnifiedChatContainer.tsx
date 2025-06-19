import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { useChatState } from '../ChatStateManager';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { FileUploadService } from '../utils/fileUploadService';

export const UnifiedChatContainer: React.FC = () => {
  const { data: templates = [], isLoading: templatesLoading } = useFigmantPromptTemplates();
  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysis();
  const { toast } = useToast();
  
  // Use the shared chat state - this should be the same instance used in FigmantLayout
  const chatState = useChatState();
  
  // Verify we have the chat state functions
  if (!chatState.setAttachments || !chatState.setMessages || !chatState.setMessage) {
    console.error('🚨 UNIFIED CHAT - Chat state functions not available!');
    return <div>Error: Chat state not properly initialized</div>;
  }

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

  // Debug logging to track state changes
  useEffect(() => {
    console.log('🔄 UNIFIED CHAT - Attachments changed:', {
      count: attachments.length,
      details: attachments.map(att => ({ 
        id: att.id, 
        type: att.type, 
        name: att.name, 
        status: att.status 
      }))
    });
  }, [attachments]);

  const getCurrentTemplate = () => {
    return templates.find(t => t.id === selectedTemplateId) || null;
  };

  const handleFileUpload = async (files: FileList) => {
    console.log('📎 UNIFIED CHAT - Starting file upload for', files.length, 'files');
    
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
      console.log('📎 UNIFIED CHAT - Created file attachment:', attachment.id, attachment.name);
    }
    
    // Add attachments to state immediately so they appear in the UI
    setAttachments(prev => {
      const updated = [...prev, ...newAttachments];
      console.log('📎 UNIFIED CHAT - Updated attachments state, new count:', updated.length);
      return updated;
    });
    
    toast({
      title: "Files Added",
      description: `${newAttachments.length} file(s) added for analysis.`,
    });
    
    // Process file uploads in background
    for (const attachment of newAttachments) {
      try {
        console.log('📤 Starting file upload for:', attachment.name);
        const uploadPath = await FileUploadService.uploadFile(attachment.file!, attachment.id);
        
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'uploaded', uploadPath }
            : att
        ));
        
        console.log('📤 File upload completed:', uploadPath);
        
      } catch (error) {
        console.error('📤 File upload failed:', error);
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'error' }
            : att
        ));
      }
    }
  };

  const handleAddUrl = async () => {
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

      console.log('🔗 UNIFIED CHAT - Creating new URL attachment:', newAttachment.id, newAttachment.name);
      
      // Update attachments state immediately so it appears in the UI
      setAttachments(prev => {
        const updated = [...prev, newAttachment];
        console.log('🔗 UNIFIED CHAT - URL attachment added to state, new count:', updated.length);
        return updated;
      });
      
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
            console.log('📸 Updated attachment with screenshots:', updatedAtt.id);
            return updatedAtt;
          }
          return att;
        }));

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
  };

  const removeAttachment = (id: string) => {
    console.log('🗑️ UNIFIED CHAT - Removing attachment:', id);
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== id);
      console.log('🗑️ UNIFIED CHAT - Attachment removed, new count:', updated.length);
      return updated;
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    if (setSelectedTemplateId) {
      setSelectedTemplateId(templateId);
    }
  };

  const handleViewTemplate = (template: any) => {
    console.log('🎯 UNIFIED CHAT - View template:', template);
    // This would open a modal or details view
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter a message or attach files/URLs.",
      });
      return;
    }

    console.log('🚀 UNIFIED CHAT - Sending message with attachments:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      attachmentDetails: attachments.map(att => ({ 
        id: att.id, 
        type: att.type, 
        name: att.name, 
        status: att.status,
        uploadPath: att.uploadPath,
        url: att.url
      }))
    });

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage('');

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

      setMessages(prev => [...prev, assistantMessage]);

      // Store the analysis result
      setLastAnalysisResult(result);

      // Clear attachments after successful analysis
      setAttachments([]);

    } catch (error) {
      console.error('Analysis error:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;

  console.log('🔄 UNIFIED CHAT CONTAINER - Current state:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    attachmentDetails: attachments.map(att => ({ id: att.id, type: att.type, name: att.name, status: att.status })),
    lastAnalysisResult: !!lastAnalysisResult,
    showUrlInput,
    urlInput,
    hasChatStateFunctions: !!(setAttachments && setMessages && setMessage)
  });

  return (
    <div className="h-full">
      <AnalysisChatContainer
        messages={messages}
        isAnalyzing={isAnalyzing}
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        getCurrentTemplate={getCurrentTemplate}
        canSend={canSend}
        onFileUpload={handleFileUpload}
        onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
        showUrlInput={showUrlInput}
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        onAddUrl={handleAddUrl}
        onCancelUrl={() => setShowUrlInput(false)}
        onTemplateSelect={handleTemplateSelect}
        availableTemplates={templates}
        onViewTemplate={handleViewTemplate}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
      />
    </div>
  );
};
