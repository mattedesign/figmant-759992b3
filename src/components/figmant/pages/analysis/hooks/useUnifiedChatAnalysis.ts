import { useState, useCallback } from 'react';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useChatState } from '../ChatStateManager';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';

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
        status: 'uploaded'
      };
      newAttachments.push(attachment);
    }
    
    if (setAttachments) {
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    
    toast({
      title: "Files Added",
      description: `${newAttachments.length} file(s) added for analysis.`,
    });
  }, [setAttachments, toast]);

  const handleAddUrl = useCallback(async (url: string) => {
    // This is now handled by URLAttachmentHandler component
    // The component will handle validation, screenshot capture, and updating attachments
  }, []);

  const removeAttachment = useCallback((id: string) => {
    if (setAttachments) {
      setAttachments(prev => prev.filter(att => att.id !== id));
    }
  }, [setAttachments]);

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

  const canSend = !isAnalyzing && (message.trim().length > 0 || attachments.length > 0);

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
    
    // Handlers
    handleFileUpload,
    handleAddUrl,
    handleSendMessage,
    handleKeyPress,
    removeAttachment,
    
    // Status
    isAnalyzing,
    canSend
  };
};
