
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { useUnifiedChatAnalysis } from '../hooks/useUnifiedChatAnalysis';

export const UnifiedChatContainer: React.FC = () => {
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

  console.log('🔄 UNIFIED CHAT CONTAINER - Current state:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    attachmentDetails: attachments.map(att => ({ id: att.id, type: att.type, name: att.name, status: att.status })),
    lastAnalysisResult: !!lastAnalysisResult,
    showUrlInput,
    urlInput
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
        availableTemplates={figmantTemplates}
        onViewTemplate={handleViewTemplate}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
      />
    </div>
  );
};
