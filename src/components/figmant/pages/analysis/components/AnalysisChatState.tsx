
import React, { useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useAnalysisChatState } from '../hooks/useAnalysisChatState';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { useFileUploadHandler } from '../useFileUploadHandler';
import { useToast } from '@/hooks/use-toast';

interface AnalysisChatStateProps {
  children: (props: AnalysisChatStateRenderProps) => React.ReactNode;
  selectedPromptTemplate?: any;
  onAnalysisComplete?: (result: any) => void;
}

interface AnalysisChatStateRenderProps {
  // State
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[]) => void;
  
  // Tab management
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Template management
  figmantTemplates: any[];
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  getCurrentTemplate: () => any;
  handleTemplateSelect: (templateId: string) => void;
  handleViewTemplate: (template: any) => void;
  showTemplateModal: boolean;
  modalTemplate: any;
  handleTemplateModalClose: () => void;
  
  // Message handling
  isAnalyzing: boolean;
  canSend: boolean;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  
  // File handling
  handleFileUpload: (files: FileList) => void;
  addUrlAttachment: (url: string) => void;
  removeAttachment: (id: string) => void;
}

export const AnalysisChatState: React.FC<AnalysisChatStateProps> = ({
  children,
  selectedPromptTemplate,
  onAnalysisComplete
}) => {
  const { toast } = useToast();
  
  // Basic state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);

  // Analysis chat state hook
  const analysisState = useAnalysisChatState({
    selectedPromptTemplate,
    onAnalysisComplete
  });

  // Chat analysis hook
  const { analyzeWithChat } = useChatAnalysis();

  // File upload handler
  const { handleFileUpload: processFileUpload } = useFileUploadHandler(setAttachments);

  // File upload wrapper
  const handleFileUpload = (files: FileList) => {
    console.log('📁 ANALYSIS CHAT STATE - Handling file upload for', files.length, 'files');
    processFileUpload(files);
  };

  const addUrlAttachment = (url: string) => {
    if (!url.trim()) return;
    
    console.log('🔗 ANALYSIS CHAT STATE - Adding URL:', url);
    
    // Validate URL format
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

      const urlAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: hostname,
        url: formattedUrl,
        status: 'uploaded'
      };
      
      setAttachments(prev => [...prev, urlAttachment]);
      
      toast({
        title: "Website Added",
        description: `${hostname} has been added for analysis.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
    }
  };

  const removeAttachment = (id: string) => {
    console.log('🗑️ ANALYSIS CHAT STATE - Removing attachment:', id);
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Message handling
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handleSendMessage = async () => {
    if (!canSend || isAnalyzing) return;

    console.log('💬 ANALYSIS CHAT STATE - Sending message with:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      selectedTemplate: analysisState.selectedTemplate
    });

    setIsAnalyzing(true);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        attachments: [...attachments],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Call analysis with current template context
      const currentTemplate = analysisState.getCurrentTemplate();
      console.log('📝 Using template for analysis:', currentTemplate?.title || 'No template');

      const result = await analyzeWithChat.mutateAsync({
        message,
        attachments
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Call analysis complete callback
      if (onAnalysisComplete) {
        onAnalysisComplete({
          analysis: result.analysis,
          debugInfo: result.debugInfo,
          response: result.analysis
        });
      }

      // Clear input and attachments
      setMessage('');
      setAttachments([]);

      toast({
        title: "Analysis Complete",
        description: "Your design analysis has been generated successfully.",
      });

    } catch (error: any) {
      console.error('Analysis failed:', error);
      
      toast({
        title: "Analysis Failed",
        description: error.message || "There was an error generating your analysis. Please try again.",
        variant: "destructive"
      });
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderProps: AnalysisChatStateRenderProps = {
    // State
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    
    // Tab management
    activeTab: analysisState.activeTab,
    setActiveTab: analysisState.setActiveTab,
    
    // Template management
    figmantTemplates: analysisState.figmantTemplates,
    selectedTemplate: analysisState.selectedTemplate,
    setSelectedTemplate: analysisState.handleTemplateSelect,
    getCurrentTemplate: analysisState.getCurrentTemplate,
    handleTemplateSelect: analysisState.handleTemplateSelect,
    handleViewTemplate: analysisState.handleViewTemplate,
    showTemplateModal: analysisState.showTemplateModal,
    modalTemplate: analysisState.modalTemplate,
    handleTemplateModalClose: analysisState.handleTemplateModalClose,
    
    // Message handling
    isAnalyzing,
    canSend,
    handleSendMessage,
    handleKeyPress,
    
    // File handling
    handleFileUpload,
    addUrlAttachment,
    removeAttachment
  };

  return <>{children(renderProps)}</>;
};
