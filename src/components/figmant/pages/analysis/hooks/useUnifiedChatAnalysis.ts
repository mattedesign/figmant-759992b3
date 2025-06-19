
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

export const useUnifiedChatAnalysis = () => {
  // Core chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  // Template state
  const { data: templates = [], isLoading: templatesLoading } = useClaudePromptExamples();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  // Analysis state
  const analysisQuery = useFigmantChatAnalysis();
  const { toast } = useToast();

  // Set default template when templates load
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplateId) {
      const masterTemplate = templates.find(t => t.category === 'master') || templates[0];
      if (masterTemplate) {
        setSelectedTemplateId(masterTemplate.id);
      }
    }
  }, [templates, selectedTemplateId]);

  // Get current template
  const getCurrentTemplate = useCallback(() => {
    return templates.find(t => t.id === selectedTemplateId);
  }, [templates, selectedTemplateId]);

  // File upload handler
  const handleFileUpload = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    console.log('🔍 UNIFIED CHAT - Uploading files:', fileArray.length);

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
        const fileName = `chat-analysis/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('design-uploads')
          .upload(fileName, file);

        if (error) throw error;

        // Update attachment with upload path using correct status
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
        // Use 'error' instead of 'failed' to match the ChatAttachment interface
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

  // Enhanced URL handler with screenshot capture
  const handleAddUrl = useCallback(async () => {
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

      // Create initial attachment with processing status
      const attachmentId = crypto.randomUUID();
      const newAttachment: ChatAttachment = {
        id: attachmentId,
        type: 'url',
        name: hostname,
        url: formattedUrl,
        status: 'processing'
      };

      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: `${hostname} added, capturing screenshot...`,
      });

      // Capture screenshot for competitor analysis
      const currentTemplate = getCurrentTemplate();
      const isCompetitorAnalysis = currentTemplate?.category === 'competitor' || 
                                  currentTemplate?.title?.toLowerCase().includes('competitor');
      
      if (isCompetitorAnalysis) {
        console.log('📸 Capturing screenshot for competitor analysis...');
        
        try {
          // Capture both desktop and mobile screenshots
          const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
            [formattedUrl], 
            true, // include desktop
            true  // include mobile
          );

          console.log('📸 Screenshot results:', screenshotResults);

          // Update attachment with screenshot data
          setAttachments(prev => prev.map(att => 
            att.id === attachmentId 
              ? { 
                  ...att, 
                  status: 'uploaded',
                  metadata: {
                    screenshots: {
                      desktop: screenshotResults.desktop?.[0],
                      mobile: screenshotResults.mobile?.[0]
                    }
                  }
                }
              : att
          ));

          toast({
            title: "Screenshot Captured",
            description: `Screenshots captured for ${hostname}`,
          });
        } catch (screenshotError) {
          console.error('Screenshot capture failed:', screenshotError);
          
          // Still mark as uploaded but without screenshots
          setAttachments(prev => prev.map(att => 
            att.id === attachmentId 
              ? { ...att, status: 'uploaded' }
              : att
          ));

          toast({
            title: "URL Added",
            description: `${hostname} added (screenshot capture failed)`,
            variant: "default"
          });
        }
      } else {
        // For non-competitor analysis, just mark as uploaded
        setAttachments(prev => prev.map(att => 
          att.id === attachmentId 
            ? { ...att, status: 'uploaded' }
            : att
        ));
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
    }
  }, [urlInput, toast, getCurrentTemplate]);

  // Send message handler
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please enter a message or attach files before sending.",
      });
      return;
    }

    console.log('🚀 UNIFIED CHAT - Sending message with:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      templateId: selectedTemplateId
    });

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      attachments: [...attachments],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Clear inputs
    const currentMessage = message;
    const currentAttachments = [...attachments];
    const currentTemplate = getCurrentTemplate();
    
    setMessage('');
    setAttachments([]);

    try {
      // Call analysis
      const result = await analysisQuery.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments,
        template: currentTemplate
      });

      // Add AI response
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      toast({
        title: "Analysis Complete",
        description: "Your design analysis has been completed.",
      });

    } catch (error) {
      console.error('🚀 UNIFIED CHAT - Error:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I encountered an error while analyzing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }, [message, attachments, selectedTemplateId, getCurrentTemplate, analysisQuery, toast]);

  // Key press handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Remove attachment handler
  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }, []);

  // Can send validation
  const canSend = (message.trim().length > 0 || attachments.length > 0) && !analysisQuery.isPending;

  return {
    // State
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
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
    
    // Handlers
    handleFileUpload,
    handleAddUrl,
    handleSendMessage,
    handleKeyPress,
    removeAttachment,
    
    // Status
    isAnalyzing: analysisQuery.isPending,
    canSend
  };
};
