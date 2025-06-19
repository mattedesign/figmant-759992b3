
import React from 'react';
import { AnalysisChatPanel } from '../AnalysisChatPanel';
import { AnalysisDynamicRightPanel } from '../AnalysisDynamicRightPanel';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AnalysisPageLayoutProps {
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
  selectedPromptTemplate: any;
  selectedPromptCategory: string;
  promptTemplates: any[];
  onAnalysisComplete: (result: any) => void;
  lastAnalysisResult: any;
  isRightPanelCollapsed: boolean;
  selectedPromptTemplateId: string;
  setSelectedPromptTemplate: (id: string) => void;
  onRemoveAttachment: (id: string) => void;
}

export const AnalysisPageLayout: React.FC<AnalysisPageLayoutProps> = ({
  message,
  setMessage,
  messages,
  setMessages,
  attachments,
  setAttachments,
  urlInput,
  setUrlInput,
  showUrlInput,
  setShowUrlInput,
  selectedPromptTemplate,
  selectedPromptCategory,
  promptTemplates,
  onAnalysisComplete,
  lastAnalysisResult,
  isRightPanelCollapsed,
  selectedPromptTemplateId,
  setSelectedPromptTemplate,
  onRemoveAttachment
}) => {
  const getRightPanelMode = () => {
    if (lastAnalysisResult || attachments.length > 0) {
      return 'analysis';
    }
    return 'empty';
  };

  return (
    <div className="flex h-full">
      {/* Center Panel - Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <AnalysisChatPanel
            message={message}
            setMessage={setMessage}
            messages={messages}
            setMessages={setMessages}
            attachments={attachments}
            setAttachments={setAttachments}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            showUrlInput={showUrlInput}
            setShowUrlInput={setShowUrlInput}
            selectedPromptTemplate={selectedPromptTemplate}
            selectedPromptCategory={selectedPromptCategory}
            promptTemplates={promptTemplates}
            onAnalysisComplete={onAnalysisComplete}
          />
        </div>
      </div>

      {/* Right Panel - Analysis Details */}
      <div className={`bg-white flex-shrink-0 transition-all duration-300 ${
        isRightPanelCollapsed ? 'w-16' : 'w-80'
      }`}>
        <AnalysisDynamicRightPanel
          mode={getRightPanelMode()}
          promptTemplates={promptTemplates}
          selectedPromptTemplate={selectedPromptTemplateId}
          onPromptTemplateSelect={setSelectedPromptTemplate}
          currentAnalysis={null}
          attachments={attachments}
          onCollapseChange={() => {}}
          onRemoveAttachment={onRemoveAttachment}
          lastAnalysisResult={lastAnalysisResult}
        />
      </div>
    </div>
  );
};
