
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { AttachmentMenu } from './AttachmentMenu';
import { TemplateDropdown } from './TemplateDropdown';
import { ModeSelector } from './ModeSelector';
import { ActionButtons } from './ActionButtons';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface ChatInputControlsProps {
  showAttachmentMenu: boolean;
  setShowAttachmentMenu: (show: boolean) => void;
  onAttachmentAction: (type: 'screenshot' | 'link' | 'camera') => void;
  showTemplateMenu: boolean;
  setShowTemplateMenu: (show: boolean) => void;
  selectedPromptTemplate: FigmantPromptTemplate | null;
  availableTemplates: FigmantPromptTemplate[];
  onTemplateSelect: (templateId: string) => void;
  showModeMenu: boolean;
  setShowModeMenu: (show: boolean) => void;
  chatMode: 'chat' | 'analyze';
  setChatMode: (mode: 'chat' | 'analyze') => void;
  onSendMessage: () => void;
  canSend: boolean;
  isAnalyzing: boolean;
  features: {
    fileUpload: boolean;
    templates: boolean;
    urlInput: boolean;
    attachments: boolean;
  };
}

export const ChatInputControls: React.FC<ChatInputControlsProps> = ({
  showAttachmentMenu,
  setShowAttachmentMenu,
  onAttachmentAction,
  showTemplateMenu,
  setShowTemplateMenu,
  selectedPromptTemplate,
  availableTemplates,
  onTemplateSelect,
  showModeMenu,
  setShowModeMenu,
  chatMode,
  setChatMode,
  onSendMessage,
  canSend,
  isAnalyzing,
  features
}) => {
  return (
    <div className="flex items-center gap-3 self-stretch">
      {/* LEFT SIDE CONTROLS - Plus Button and Template Dropdown */}
      <div className="flex items-center gap-3 flex-1 justify-start">
        {/* EXPANDABLE PLUS BUTTON - Only show if file upload is available */}
        {features.fileUpload && (
          <AttachmentMenu
            showAttachmentMenu={showAttachmentMenu}
            setShowAttachmentMenu={setShowAttachmentMenu}
            onAttachmentAction={onAttachmentAction}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* TEMPLATE DROPDOWN - Only show if templates are available */}
        {features.templates && (
          <TemplateDropdown
            showTemplateMenu={showTemplateMenu}
            setShowTemplateMenu={setShowTemplateMenu}
            selectedPromptTemplate={selectedPromptTemplate}
            availableTemplates={availableTemplates}
            onTemplateSelect={onTemplateSelect}
            isAnalyzing={isAnalyzing}
          />
        )}
      </div>
      
      {/* RIGHT SIDE CONTROLS - Mode Selector and Submit Button */}
      <div className="flex items-center gap-3">
        {/* MODE SELECTOR */}
        <ModeSelector
          showModeMenu={showModeMenu}
          setShowModeMenu={setShowModeMenu}
          chatMode={chatMode}
          setChatMode={setChatMode}
          isAnalyzing={isAnalyzing}
        />

        {/* SUBMIT BUTTON */}
        <button 
          onClick={onSendMessage}
          disabled={!canSend || isAnalyzing}
          className="flex w-11 h-11 justify-center items-center gap-2 hover:from-[#E0E0E0] hover:to-[#DDDDDD] transition-all disabled:opacity-50"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(180deg, #E5E5E5 0%, #E2E2E2 100%)',
            boxShadow: '0px 3px 4px -1px rgba(0, 0, 0, 0.15), 0px 1px 0px 0px rgba(255, 255, 255, 0.33) inset, 0px 0px 0px 1px #D4D4D4'
          }}
        >
          {isAnalyzing ? (
            <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5 text-[#121212] flex-shrink-0" />
          )}
        </button>

        {/* ACTION BUTTONS COMPONENT (for microphone or other future controls) */}
        <ActionButtons
          isAnalyzing={isAnalyzing}
        />
      </div>
    </div>
  );
};
