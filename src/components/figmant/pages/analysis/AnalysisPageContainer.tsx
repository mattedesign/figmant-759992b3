
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnalysisPageLayout } from './components/AnalysisPageLayout';
import { UnifiedChatContainer } from './components/UnifiedChatContainer';
import { PremiumAnalysisWizard } from '../premium-analysis/PremiumAnalysisWizard';
import { useChatState } from './ChatStateManager';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';

interface AnalysisPageContainerProps {
  selectedTemplate?: any;
}

export const AnalysisPageContainer: React.FC<AnalysisPageContainerProps> = ({
  selectedTemplate
}) => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'chat' | 'wizard'>('chat');
  const chatState = useChatState();
  const { data: promptTemplates = [] } = useClaudePromptExamples();

  // Check if wizard mode is requested via URL params
  useEffect(() => {
    const wizardMode = searchParams.get('mode');
    if (wizardMode === 'wizard') {
      setMode('wizard');
    }
  }, [searchParams]);

  console.log('🏗️ ANALYSIS PAGE CONTAINER - Mode:', mode);

  // If wizard mode, render the wizard
  if (mode === 'wizard') {
    return (
      <div className="h-full flex flex-col min-h-0">
        <PremiumAnalysisWizard />
      </div>
    );
  }

  // Default chat mode
  return (
    <div className="h-full flex flex-col min-h-0">
      <AnalysisPageLayout
        message={chatState.message}
        setMessage={chatState.setMessage}
        messages={chatState.messages}
        setMessages={chatState.setMessages}
        attachments={chatState.attachments}
        setAttachments={chatState.setAttachments}
        urlInput={chatState.urlInput}
        setUrlInput={chatState.setUrlInput}
        showUrlInput={chatState.showUrlInput}
        setShowUrlInput={chatState.setShowUrlInput}
        selectedPromptTemplate={selectedTemplate}
        selectedPromptCategory=""
        promptTemplates={promptTemplates}
        isRightPanelCollapsed={false}
        selectedPromptTemplateId=""
        setSelectedPromptTemplate={() => {}}
        onRemoveAttachment={(id) => {
          chatState.setAttachments(prev => prev.filter(att => att.id !== id));
        }}
      />
    </div>
  );
};
