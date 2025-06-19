
import React, { useState, useEffect } from 'react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { AttachmentDisplay } from './AttachmentDisplay';
import { MessageTextArea } from './MessageTextArea';
import { ChatInputControls } from './ChatInputControls';
import { URLInputSection } from './URLInputSection';

interface ChatInputContainerProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedPromptTemplate: FigmantPromptTemplate | null;
  canSend: boolean;
  isAnalyzing: boolean;
  onFileUpload: (files: FileList) => void;
  onToggleUrlInput: () => void;
  onTemplateSelect: (templateId: string) => void;
  availableTemplates: FigmantPromptTemplate[];
  onViewTemplate: (template: FigmantPromptTemplate) => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  showUrlInput: boolean;
  urlInput: string;
  setUrlInput: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
  chatMode: 'chat' | 'analyze';
  onModeChange: (mode: 'chat' | 'analyze') => void;
  placeholder: string;
  features: {
    fileUpload: boolean;
    templates: boolean;
    urlInput: boolean;
    attachments: boolean;
  };
}

export const ChatInputContainer: React.FC<ChatInputContainerProps> = ({
  message,
  setMessage,
  onSendMessage,
  onKeyPress,
  selectedPromptTemplate,
  canSend,
  isAnalyzing,
  onFileUpload,
  onToggleUrlInput,
  onTemplateSelect,
  availableTemplates,
  onViewTemplate,
  attachments,
  onRemoveAttachment,
  showUrlInput,
  urlInput,
  setUrlInput,
  onAddUrl,
  onCancelUrl,
  chatMode,
  onModeChange,
  placeholder,
  features
}) => {
  // New state for modern interface
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

  // Ensure Master UX template is selected by default in analyze mode
  useEffect(() => {
    if (chatMode === 'analyze' && !selectedPromptTemplate && availableTemplates.length > 0) {
      const masterTemplate = availableTemplates.find(template => 
        template.displayName?.toLowerCase().includes('master') || 
        template.title?.toLowerCase().includes('master')
      );
      if (masterTemplate) {
        onTemplateSelect(masterTemplate.id);
      } else if (availableTemplates[0]) {
        // Fallback to first template if no Master template found
        onTemplateSelect(availableTemplates[0].id);
      }
    }
  }, [chatMode, selectedPromptTemplate, availableTemplates, onTemplateSelect]);

  const handleAttachmentAction = (type: 'screenshot' | 'link' | 'camera') => {
    setShowAttachmentMenu(false);
    
    if (!features.fileUpload && (type === 'screenshot' || type === 'camera')) {
      return; // Feature not available in current mode
    }
    
    if (!features.urlInput && type === 'link') {
      return; // Feature not available in current mode
    }
    
    switch (type) {
      case 'screenshot':
        // Trigger existing file upload
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,.pdf,.sketch,.fig,.xd';
        fileInput.multiple = true;
        fileInput.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          if (target.files) {
            onFileUpload(target.files);
          }
        };
        fileInput.click();
        break;
      case 'link':
        onToggleUrlInput();
        break;
      case 'camera':
        // Future camera functionality
        break;
    }
  };

  return (
    <div className="flex flex-col items-start gap-6 p-3 rounded-3xl border border-[#ECECEC] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13),0px_2px_0px_0px_#FFF_inset,0px_8px_16px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md lg:gap-6 md:gap-4 sm:gap-3 sm:p-2">
      
      {/* ATTACHMENT DISPLAY SECTION */}
      {features.attachments && attachments.length > 0 && (
        <AttachmentDisplay 
          attachments={attachments}
          onRemoveAttachment={onRemoveAttachment}
        />
      )}

      {/* TEXT INPUT AREA */}
      <MessageTextArea
        message={message}
        setMessage={setMessage}
        onKeyPress={onKeyPress}
        selectedPromptTemplate={selectedPromptTemplate}
        chatMode={chatMode}
        isAnalyzing={isAnalyzing}
        placeholder={placeholder}
      />

      {/* ACTIONS BAR */}
      <ChatInputControls
        showAttachmentMenu={showAttachmentMenu}
        setShowAttachmentMenu={setShowAttachmentMenu}
        onAttachmentAction={handleAttachmentAction}
        showTemplateMenu={showTemplateMenu}
        setShowTemplateMenu={setShowTemplateMenu}
        selectedPromptTemplate={selectedPromptTemplate}
        availableTemplates={availableTemplates}
        onTemplateSelect={onTemplateSelect}
        showModeMenu={showModeMenu}
        setShowModeMenu={setShowModeMenu}
        chatMode={chatMode}
        setChatMode={onModeChange}
        onSendMessage={onSendMessage}
        canSend={canSend}
        isAnalyzing={isAnalyzing}
        features={features}
      />

      {/* URL INPUT SECTION (if active) */}
      {showUrlInput && features.urlInput && (
        <URLInputSection
          showUrlInput={showUrlInput}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          onAddUrl={onAddUrl}
          onCancelUrl={onCancelUrl}
        />
      )}
    </div>
  );
};
