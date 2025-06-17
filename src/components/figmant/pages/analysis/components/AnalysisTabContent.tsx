
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';
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
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
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
        </TabsContent>

        <TabsContent value="wizard" className="flex-1 overflow-hidden mt-0">
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Wizard Coming Soon</h3>
              <p>This guided analysis wizard will help you step through your design analysis.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
