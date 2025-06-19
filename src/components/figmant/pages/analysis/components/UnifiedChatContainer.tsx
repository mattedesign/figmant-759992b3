
import React from 'react';
import { AnalysisChatInput } from '../AnalysisChatInput';
import { ChatMessages } from '../ChatMessages';
import { ChatLoadingState } from './ChatLoadingState';
import { ChatSidebar } from './ChatSidebar';
import { useUnifiedChatAnalysis } from '../hooks/useUnifiedChatAnalysis';

export const UnifiedChatContainer: React.FC = () => {
  const {
    messages,
    message,
    setMessage,
    attachments,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    templates,
    templatesLoading,
    selectedTemplateId,
    setSelectedTemplateId,
    getCurrentTemplate,
    handleFileUpload,
    handleAddUrl,
    handleSendMessage,
    handleKeyPress,
    removeAttachment,
    isAnalyzing,
    canSend
  } = useUnifiedChatAnalysis();

  const selectedTemplate = getCurrentTemplate();

  console.log('🎯 UNIFIED CHAT CONTAINER - Rendering with:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    templatesCount: templates.length,
    selectedTemplate: selectedTemplate?.title || 'None',
    isAnalyzing,
    canSend,
    templatesLoading
  });

  // Show loading state while templates are loading
  if (templatesLoading) {
    return <ChatLoadingState message="Loading analysis templates..." />;
  }

  const handleViewAttachment = (attachment: any) => {
    console.log('View attachment:', attachment);
    // Could open a modal or preview
  };

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages 
            messages={messages}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Input Area */}
        <div className="border-t bg-background">
          <AnalysisChatInput
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            selectedPromptTemplate={selectedTemplate}
            canSend={canSend}
            isAnalyzing={isAnalyzing}
            onFileUpload={handleFileUpload}
            onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
            onTemplateSelect={setSelectedTemplateId}
            availableTemplates={templates}
            onViewTemplate={(template) => console.log('View template:', template)}
            attachments={attachments}
            onRemoveAttachment={removeAttachment}
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onAddUrl={handleAddUrl}
            onCancelUrl={() => setShowUrlInput(false)}
          />
        </div>
      </div>

      {/* Dynamic Sidebar */}
      <ChatSidebar
        messages={messages}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        onViewAttachment={handleViewAttachment}
        lastAnalysisResult={messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content}
      />
    </div>
  );
};
