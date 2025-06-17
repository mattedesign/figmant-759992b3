
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalysisChatTabs } from './AnalysisChatTabs';
import { AnalysisTabContent } from './components/AnalysisTabContent';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';

interface AnalysisChatPanelProps {
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
  onCollapseHistory?: () => void;
  promptTemplates?: any[];
  selectedPromptCategory?: string;
  selectedPromptTemplate?: string;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  onCollapseHistory,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('chat');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => props.handleFileUpload(file));
    }
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => props.handleFileUpload(file));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with tabs */}
      <div className="flex-shrink-0 p-6 pb-0">
        <AnalysisChatTabs
          showUrlInput={props.showUrlInput}
          setShowUrlInput={props.setShowUrlInput}
          onFileSelect={handleFileSelect}
          onFileUpload={handleFileUpload}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0">
        <AnalysisTabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCollapseHistory={onCollapseHistory}
          {...props}
        />
      </div>
    </div>
  );
};
