
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisChatHeader } from './AnalysisChatHeader';
import { PromptTemplateModal } from './PromptTemplateModal';
import { URLInputSection } from './URLInputSection';
import { AnalysisChatState } from './components/AnalysisChatState';
import { URLAttachmentHandler } from './components/URLAttachmentHandler';
import { AnalysisTabContent } from './components/AnalysisTabContent';

interface AnalysisChatPanelProps {
  message: string;
  setMessage: (message: string) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
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
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
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
  onAnalysisComplete
}) => {
  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] min-h-0">
      <AnalysisChatState
        selectedPromptTemplate={selectedPromptTemplate}
        onAnalysisComplete={onAnalysisComplete}
      >
        {(stateProps) => (
          <URLAttachmentHandler
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            setShowUrlInput={setShowUrlInput}
            attachments={stateProps.attachments}
            setAttachments={stateProps.setAttachments}
          >
            {(handleAddUrl) => (
              <div className="h-full flex flex-col min-h-0">
                {/* Header with Tabs */}
                <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
                  <AnalysisChatHeader 
                    activeTab={stateProps.activeTab}
                    onTabChange={stateProps.setActiveTab}
                  />
                </div>

                {/* Tabbed Content - This needs to take remaining height */}
                <div className="flex-1 min-h-0">
                  <AnalysisTabContent
                    activeTab={stateProps.activeTab}
                    setActiveTab={stateProps.setActiveTab}
                    messages={stateProps.messages}
                    isAnalyzing={stateProps.isAnalyzing}
                    message={stateProps.message}
                    setMessage={stateProps.setMessage}
                    handleSendMessage={stateProps.handleSendMessage}
                    handleKeyPress={stateProps.handleKeyPress}
                    getCurrentTemplate={stateProps.getCurrentTemplate}
                    canSend={stateProps.canSend}
                    handleFileUpload={stateProps.handleFileUpload}
                    showUrlInput={showUrlInput}
                    setShowUrlInput={setShowUrlInput}
                    urlInput={urlInput}
                    setUrlInput={setUrlInput}
                    handleAddUrl={handleAddUrl}
                    handleTemplateSelect={stateProps.handleTemplateSelect}
                    figmantTemplates={stateProps.figmantTemplates}
                    handleViewTemplate={stateProps.handleViewTemplate}
                    attachments={stateProps.attachments}
                    removeAttachment={stateProps.removeAttachment}
                  />
                </div>

                {/* URL Input */}
                {showUrlInput && (
                  <div className="flex-shrink-0">
                    <URLInputSection 
                      urlInput={urlInput} 
                      setUrlInput={setUrlInput} 
                      onAddUrl={handleAddUrl} 
                      onCancel={() => setShowUrlInput(false)} 
                    />
                  </div>
                )}

                {/* Template Details Modal */}
                <PromptTemplateModal 
                  template={stateProps.modalTemplate}
                  isOpen={stateProps.showTemplateModal}
                  onClose={stateProps.handleTemplateModalClose}
                  onTemplateSelect={stateProps.handleTemplateSelect}
                />
              </div>
            )}
          </URLAttachmentHandler>
        )}
      </AnalysisChatState>
    </div>
  );
};
