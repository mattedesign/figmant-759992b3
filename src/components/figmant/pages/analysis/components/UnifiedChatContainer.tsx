
import React, { useState, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatState } from '../ChatStateManager';
import { useMessageHandler } from '../useMessageHandler';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { NavigationSectionList } from './NavigationSectionList';
import { ChatInputContainer } from './ChatInputContainer';
import { ChatMessageArea } from './ChatMessageArea';
import { URLInputSection } from './URLInputSection';
import { useFileUploadHandlers } from '@/hooks/useFileUploadHandlers';
import { useToast } from '@/hooks/use-toast';

export const UnifiedChatContainer: React.FC = () => {
  const {
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
    selectedPromptTemplate,
    setSelectedPromptTemplate,
  } = useChatState();

  // Mode state
  const [chatMode, setChatMode] = useState<'chat' | 'analyze'>('analyze');
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');

  const { templates } = useFigmantPromptTemplates();
  const { toast } = useToast();

  // File upload handlers
  const { handleFileUpload } = useFileUploadHandlers({
    onUploadComplete: (file, uploadPath) => {
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file: file,
        uploadPath: uploadPath,
        status: 'uploaded'
      };
      setAttachments(prev => [...prev, newAttachment]);
    },
    onUploadError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error
      });
    }
  });

  // Message handler with mode support
  const { isAnalyzing, canSend, handleSendMessage, handleKeyPress } = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate: templates.find(t => t.id === selectedPromptTemplate),
    onAnalysisComplete: (result) => {
      setLastAnalysisResult(result);
    },
    chatMode
  });

  // Clear attachments when switching to chat mode
  useEffect(() => {
    if (chatMode === 'chat' && attachments.length > 0) {
      setAttachments([]);
    }
  }, [chatMode, setAttachments]);

  const handleModeChange = (newMode: 'chat' | 'analyze') => {
    setChatMode(newMode);
    
    // Clear attachments when switching to chat mode
    if (newMode === 'chat' && attachments.length > 0) {
      setAttachments([]);
    }
  };

  const getPlaceholderText = () => {
    if (chatMode === 'chat') {
      return "How can I help...";
    } else {
      return "Describe what you'd like me to analyze...";
    }
  };

  const getFeatureAvailability = () => {
    return {
      fileUpload: chatMode === 'analyze',
      templates: chatMode === 'analyze',
      urlInput: chatMode === 'analyze',
      attachments: chatMode === 'analyze'
    };
  };

  const handleFileUploadWrapper = (files: FileList) => {
    if (chatMode === 'chat') {
      toast({
        variant: "destructive",
        title: "Feature Not Available",
        description: "File uploads are only available in Analyze mode."
      });
      return;
    }
    handleFileUpload(files);
  };

  const handleToggleUrlInput = () => {
    if (chatMode === 'chat') {
      toast({
        variant: "destructive",
        title: "Feature Not Available",
        description: "URL input is only available in Analyze mode."
      });
      return;
    }
    setShowUrlInput(!showUrlInput);
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL."
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
        description: `${hostname} has been added to your message`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL."
      });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleViewAttachment = (attachment: ChatAttachment) => {
    // Implement view attachment logic
    console.log('Viewing attachment:', attachment);
  };

  const fileAttachments = attachments.filter(att => att.type === 'file');
  const urlAttachments = attachments.filter(att => att.type === 'url');
  const features = getFeatureAvailability();

  return (
    <div className="h-full flex bg-transparent">
      {/* Left Navigation Panel */}
      <div className="w-80 border-r border-gray-200 flex-shrink-0">
        <NavigationSectionList
          fileAttachments={fileAttachments}
          urlAttachments={urlAttachments}
          analysisMessages={messages}
          lastAnalysisResult={lastAnalysisResult}
          onRemoveAttachment={handleRemoveAttachment}
          onViewAttachment={handleViewAttachment}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <ChatMessageArea 
            messages={messages}
            isAnalyzing={isAnalyzing}
            chatMode={chatMode}
          />
        </div>

        {/* URL Input Section (if active) */}
        {showUrlInput && features.urlInput && (
          <URLInputSection
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onAddUrl={handleAddUrl}
            onCancelUrl={() => setShowUrlInput(false)}
          />
        )}

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <ChatInputContainer
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            selectedPromptTemplate={templates.find(t => t.id === selectedPromptTemplate) || null}
            canSend={canSend}
            isAnalyzing={isAnalyzing}
            onFileUpload={handleFileUploadWrapper}
            onToggleUrlInput={handleToggleUrlInput}
            onTemplateSelect={setSelectedPromptTemplate}
            availableTemplates={templates}
            onViewTemplate={(template) => console.log('View template:', template)}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onAddUrl={handleAddUrl}
            onCancelUrl={() => setShowUrlInput(false)}
            chatMode={chatMode}
            onModeChange={handleModeChange}
            placeholder={getPlaceholderText()}
            features={features}
          />
        </div>
      </div>
    </div>
  );
};
