
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PremiumAnalysisWizard } from '../../premium-analysis/PremiumAnalysisWizard';
import { AnalysisChatContainer } from './AnalysisChatContainer';

interface AnalysisTabContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: ChatMessage[];
  isAnalyzing: boolean;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  getCurrentTemplate: () => any;
  canSend: boolean;
  handleFileUpload: (file: File) => void;
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  urlInput: string;
  setUrlInput: (url: string) => void;
  handleAddUrl: (urlInput: string) => void;
  handleTemplateSelect: (templateId: string) => void;
  figmantTemplates: any[];
  handleViewTemplate: (template: any) => void;
  attachments: ChatAttachment[];
  removeAttachment: (id: string) => void;
}

export const AnalysisTabContent: React.FC<AnalysisTabContentProps> = ({
  activeTab,
  setActiveTab,
  messages,
  isAnalyzing,
  message,
  setMessage,
  handleSendMessage,
  handleKeyPress,
  getCurrentTemplate,
  canSend,
  handleFileUpload,
  showUrlInput,
  setShowUrlInput,
  urlInput,
  setUrlInput,
  handleAddUrl,
  handleTemplateSelect,
  figmantTemplates,
  handleViewTemplate,
  attachments,
  removeAttachment
}) => {
  const handleFileUploadFromInput = (files: FileList) => {
    Array.from(files).forEach(file => handleFileUpload(file));
  };

  const handleToggleUrlInput = () => setShowUrlInput(!showUrlInput);
  const handleCancelUrl = () => setShowUrlInput(false);
  
  const handleAddUrlWithInput = () => handleAddUrl(urlInput);

  return (
    <div className="h-full flex flex-col min-h-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col min-h-0">
        <TabsContent value="chat" className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <div className="h-full flex flex-col min-h-0">
            <AnalysisChatContainer
              messages={messages}
              isAnalyzing={isAnalyzing}
              message={message}
              setMessage={setMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
              getCurrentTemplate={getCurrentTemplate}
              canSend={canSend}
              onFileUpload={handleFileUploadFromInput}
              onToggleUrlInput={handleToggleUrlInput}
              showUrlInput={showUrlInput}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              onAddUrl={handleAddUrlWithInput}
              onCancelUrl={handleCancelUrl}
              onTemplateSelect={handleTemplateSelect}
              availableTemplates={figmantTemplates}
              onViewTemplate={handleViewTemplate}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
            />
          </div>
        </TabsContent>

        <TabsContent value="wizard" className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <div className="h-full flex flex-col min-h-0">
            <PremiumAnalysisWizard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
