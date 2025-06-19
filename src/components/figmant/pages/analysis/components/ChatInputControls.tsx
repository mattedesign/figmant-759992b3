
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
  isAnalyzing
}) => {
  return (
    <div className="flex items-center gap-3 self-stretch">
      {/* LEFT SIDE CONTROLS - Plus Button and Template Dropdown */}
      <div className="flex items-center gap-3 flex-1 justify-start">
        {/* EXPANDABLE PLUS BUTTON */}
        <AttachmentMenu
          showAttachmentMenu={showAttachmentMenu}
          setShowAttachmentMenu={setShowAttachmentMenu}
          onAttachmentAction={onAttachmentAction}
          isAnalyzing={isAnalyzing}
        />

        {/* TEMPLATE DROPDOWN */}
        <TemplateDropdown
          showTemplateMenu={showTemplateMenu}
          setShowTemplateMenu={setShowTemplateMenu}
          selectedPromptTemplate={selectedPromptTemplate}
          availableTemplates={availableTemplates}
          onTemplateSelect={onTemplateSelect}
          isAnalyzing={isAnalyzing}
        />
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
          className="flex w-11 h-11 justify-center items-center gap-2 rounded-xl bg-gradient-to-b from-[#E5E5E5] to-[#E2E2E2] shadow-[0px_3px_4px_-1px_rgba(0,0,0,0.15),0px_1px_0px_0px_rgba(255,255,255,0.33)_inset,0px_0px_0px_1px_#D4D4D4] hover:from-[#E0E0E0] hover:to-[#DDDDDD] transition-all disabled:opacity-50"
          style={{
            width: '44px',
            height: '44px'
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
