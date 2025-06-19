
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { useUnifiedChatAnalysis } from '../hooks/useUnifiedChatAnalysis';

export const UnifiedChatContainer: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<ChatAttachment | null>(null);
  
  const {
    messages,
    attachments,
    isAnalyzing,
    message,
    setMessage,
    handleSendMessage,
    removeAttachment,
    handleFileUpload,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    handleAddUrl,
    handleTemplateSelect,
    figmantTemplates,
    handleViewTemplate,
    getCurrentTemplate,
    lastAnalysisResult
  } = useUnifiedChatAnalysis();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handleViewAttachment = (attachment: ChatAttachment) => {
    setSelectedAttachment(attachment);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  console.log('🔄 UNIFIED CHAT CONTAINER - Current state:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    sidebarCollapsed,
    lastAnalysisResult: !!lastAnalysisResult
  });

  return (
    <div className="h-full flex gap-4">
      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
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
          availableTemplates={figmantTemplates}
          onViewTemplate={handleViewTemplate}
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
        />
      </div>

      {/* Analysis Assets Sidebar */}
      <div className="flex-none">
        <AnalysisNavigationSidebar
          messages={messages}
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
          onViewAttachment={handleViewAttachment}
          lastAnalysisResult={lastAnalysisResult}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* Collapse/Expand Toggle for when sidebar is collapsed */}
      {sidebarCollapsed && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSidebar}
            className="h-10 w-10 p-0 bg-white shadow-lg border-gray-200"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
