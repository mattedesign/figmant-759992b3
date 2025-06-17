
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { ChatAttachment, ChatMessage } from '@/components/design/DesignChatInterface';
import { ChatMessages } from './ChatMessages';
import { AttachmentPreview } from './AttachmentPreview';
import { URLInputSection } from './URLInputSection';
import { AnalysisChatHeader } from './AnalysisChatHeader';
import { AnalysisChatInput } from './AnalysisChatInput';
import { AnalysisChatPlaceholder } from './AnalysisChatPlaceholder';
import { PromptTemplateModal } from './PromptTemplateModal';
import { useAttachmentHandlers } from '@/components/design/chat/hooks/useAttachmentHandlers';
import { useFileUploadHandler } from './useFileUploadHandler';
import { useMessageHandler } from './useMessageHandler';
import { useFigmantPromptTemplates } from '@/hooks/useFigmantChatAnalysis';

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
  const { data: figmantTemplates = [] } = useFigmantPromptTemplates();
  
  // Default to Master UX Analysis template
  const masterTemplate = figmantTemplates.find(t => t.category === 'master') || figmantTemplates[0];
  const [selectedTemplate, setSelectedTemplate] = useState(selectedPromptTemplate?.id || masterTemplate?.id || 'master');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<any>(null);
  
  const {
    addUrlAttachment,
    removeAttachment
  } = useAttachmentHandlers(attachments, setAttachments, setUrlInput, setShowUrlInput);
  const {
    handleFileUpload
  } = useFileUploadHandler(setAttachments);

  // Get the current template object
  const getCurrentTemplate = () => {
    return figmantTemplates.find(t => t.id === selectedTemplate) || 
           masterTemplate ||
           figmantTemplates[0];
  };

  // Use the real message handler that connects to Claude AI
  const {
    isAnalyzing,
    canSend,
    handleSendMessage,
    handleKeyPress
  } = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate: getCurrentTemplate(),
    selectedPromptCategory,
    promptTemplates,
    onAnalysisComplete
  });

  const handleAddUrl = () => {
    addUrlAttachment(urlInput);
  };

  const handleFileUploadFromInput = (files: FileList) => {
    Array.from(files).forEach(handleFileUpload);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleViewTemplate = (template: any) => {
    setModalTemplate(template);
    setShowTemplateModal(true);
  };
  
  // Only show messages when there are actual messages, not when user is typing
  const hasMessages = messages.length > 0;
  
  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="p-6 bg-transparent">
        <AnalysisChatHeader />
        
        {/* Prompt Template Selection */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Analysis Template
            </label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select analysis template" />
              </SelectTrigger>
              <SelectContent>
                {figmantTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{template.display_name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-60">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleViewTemplate(getCurrentTemplate())}
            title="View template details"
            className="mt-6"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area or Placeholder */}
      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        {hasMessages ? (
          <div className="p-6">
            <ChatMessages messages={messages} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <AnalysisChatPlaceholder />
          </div>
        )}
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <URLInputSection 
          urlInput={urlInput} 
          setUrlInput={setUrlInput} 
          onAddUrl={handleAddUrl} 
          onCancel={() => setShowUrlInput(false)} 
        />
      )}

      {/* Chat Input */}
      <AnalysisChatInput 
        message={message} 
        setMessage={setMessage} 
        onSendMessage={handleSendMessage} 
        onKeyPress={handleKeyPress} 
        selectedPromptTemplate={getCurrentTemplate()} 
        canSend={canSend} 
        isAnalyzing={isAnalyzing} 
        onFileUpload={handleFileUploadFromInput} 
        onToggleUrlInput={() => setShowUrlInput(!showUrlInput)} 
      />

      {/* Template Details Modal */}
      <PromptTemplateModal 
        template={modalTemplate}
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />
    </div>
  );
};
