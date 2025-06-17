
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisChatHeader } from './AnalysisChatHeader';
import { AnalysisChatContainer } from './components/AnalysisChatContainer';
import { PromptTemplateModal } from './PromptTemplateModal';
import { useAttachmentHandlers } from '@/components/design/chat/hooks/useAttachmentHandlers';
import { useFileUploadHandler } from './useFileUploadHandler';
import { useMessageHandler } from './useMessageHandler';
import { useAnalysisChatState } from './hooks/useAnalysisChatState';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const {
    figmantTemplates,
    selectedTemplate,
    showTemplateModal,
    modalTemplate,
    getCurrentTemplate,
    handleTemplateSelect,
    handleViewTemplate,
    setShowTemplateModal,
    setModalTemplate
  } = useAnalysisChatState({ selectedPromptTemplate, onAnalysisComplete });

  const {
    addUrlAttachment,
    removeAttachment
  } = useAttachmentHandlers(attachments, setAttachments, setUrlInput, setShowUrlInput);

  const {
    handleFileUpload
  } = useFileUploadHandler(setAttachments);

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
    if (urlInput.trim()) {
      console.log('Adding URL:', urlInput);
      
      // Validate URL format
      let formattedUrl = urlInput.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      try {
        const urlObj = new URL(formattedUrl);
        const hostname = urlObj.hostname;

        // Check if URL already exists
        const urlExists = attachments.some(att => att.url === formattedUrl);
        if (urlExists) {
          toast({
            variant: "destructive",
            title: "URL Already Added",
            description: `${hostname} is already in your attachments.`,
          });
          return;
        }

        // Create new URL attachment
        const newAttachment: ChatAttachment = {
          id: crypto.randomUUID(),
          type: 'url',
          name: hostname,
          url: formattedUrl,
          status: 'uploaded'
        };

        console.log('Creating new URL attachment:', newAttachment);
        setAttachments(prev => {
          const updated = [...prev, newAttachment];
          console.log('Updated attachments:', updated);
          return updated;
        });
        
        setUrlInput('');
        setShowUrlInput(false);
        
        toast({
          title: "Website Added",
          description: `${hostname} has been added for analysis.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid URL",
          description: "Please enter a valid website URL.",
        });
      }
    }
  };

  const handleFileUploadFromInput = (files: FileList) => {
    Array.from(files).forEach(handleFileUpload);
  };

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="p-6 bg-transparent">
        <AnalysisChatHeader />
      </div>

      {/* Chat Container */}
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

      {/* Template Details Modal */}
      <PromptTemplateModal 
        template={modalTemplate}
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};
