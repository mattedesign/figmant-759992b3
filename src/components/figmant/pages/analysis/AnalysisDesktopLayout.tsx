
import React from 'react';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { AnalysisDynamicRightPanel } from './AnalysisDynamicRightPanel';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AnalysisDesktopLayoutProps {
  selectedAnalysis?: any;
  onAnalysisSelect?: (analysis: any) => void;
  chatPanelProps: {
    message: string;
    setMessage: (message: string) => void;
    messages: any[];
    setMessages: (messages: any[]) => void;
    attachments: ChatAttachment[];
    setAttachments: (attachments: ChatAttachment[]) => void;
    urlInput: string;
    setUrlInput: (url: string) => void;
    showUrlInput: boolean;
    setShowUrlInput: (show: boolean) => void;
    selectedPromptTemplate?: any;
    selectedPromptCategory?: string;
    promptTemplates?: any[];
    onAnalysisComplete?: (result: any) => void;
  };
  rightPanelMode: 'templates' | 'analysis';
  promptTemplates?: any[];
  selectedPromptCategory?: string;
  selectedPromptTemplate?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
  onPromptCategoryChange?: (category: string) => void;
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
}

export const AnalysisDesktopLayout: React.FC<AnalysisDesktopLayoutProps> = ({
  selectedAnalysis,
  onAnalysisSelect,
  chatPanelProps,
  rightPanelMode,
  promptTemplates,
  selectedPromptTemplate,
  onPromptTemplateSelect,
  currentAnalysis,
  attachments = [],
  onAnalysisClick,
  onBackClick
}) => {
  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = chatPanelProps.attachments.filter(att => att.id !== id);
    chatPanelProps.setAttachments(updatedAttachments);
  };

  const handleFileUpload = (files: FileList) => {
    // This would be handled by the chat panel's file upload logic
    console.log('File upload in right panel:', files);
  };

  // Determine the right panel mode based on analysis state
  const getRightPanelMode = () => {
    // If analysis is running or complete, show analysis details
    if (currentAnalysis || chatPanelProps.messages.length > 0) {
      return 'analysis';
    }
    // If templates mode is explicitly set, show templates
    if (rightPanelMode === 'templates') {
      return 'templates';
    }
    // Default to upload mode
    return 'upload';
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Main Chat Panel */}
      <div className="flex-1 min-w-0">
        <AnalysisChatPanel 
          {...chatPanelProps} 
          onPromptTemplateSelect={onPromptTemplateSelect}
        />
      </div>

      {/* Right Panel */}
      <div className="w-80 flex-shrink-0">
        <AnalysisDynamicRightPanel
          mode={getRightPanelMode()}
          promptTemplates={promptTemplates}
          selectedPromptTemplate={selectedPromptTemplate}
          onPromptTemplateSelect={onPromptTemplateSelect}
          currentAnalysis={currentAnalysis}
          attachments={chatPanelProps.attachments}
          onAnalysisClick={onAnalysisClick}
          onBackClick={onBackClick}
          onRemoveAttachment={handleRemoveAttachment}
          onFileUpload={handleFileUpload}
          onToggleUrlInput={() => chatPanelProps.setShowUrlInput(!chatPanelProps.showUrlInput)}
        />
      </div>
    </div>
  );
};
