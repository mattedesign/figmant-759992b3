
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { AttachmentMenu } from './components/AttachmentMenu';
import { TemplateDropdown } from './components/TemplateDropdown';
import { ModeSelector } from './components/ModeSelector';
import { AttachmentDisplay } from './components/AttachmentDisplay';
import { MessageTextArea } from './components/MessageTextArea';
import { ActionButtons } from './components/ActionButtons';

interface AnalysisChatInputProps {
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
}

export const AnalysisChatInput: React.FC<AnalysisChatInputProps> = ({
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
  onCancelUrl
}) => {
  // New state for modern interface
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'analyze'>('analyze');

  const handleAttachmentAction = (type: 'screenshot' | 'link' | 'camera') => {
    setShowAttachmentMenu(false);
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
      <AttachmentDisplay 
        attachments={attachments}
        onRemoveAttachment={onRemoveAttachment}
      />

      {/* TEXT INPUT AREA */}
      <MessageTextArea
        message={message}
        setMessage={setMessage}
        onKeyPress={onKeyPress}
        selectedPromptTemplate={selectedPromptTemplate}
        chatMode={chatMode}
        isAnalyzing={isAnalyzing}
      />

      {/* ACTIONS BAR */}
      <div className="flex justify-between items-center self-stretch sm:flex-col sm:gap-3 sm:items-stretch">
        
        {/* LEFT SIDE CONTROLS */}
        <div className="flex items-center gap-3 sm:justify-between sm:w-full">
          
          {/* EXPANDABLE PLUS BUTTON */}
          <AttachmentMenu
            showAttachmentMenu={showAttachmentMenu}
            setShowAttachmentMenu={setShowAttachmentMenu}
            onAttachmentAction={handleAttachmentAction}
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

          {/* MODE SELECTOR */}
          <ModeSelector
            showModeMenu={showModeMenu}
            setShowModeMenu={setShowModeMenu}
            chatMode={chatMode}
            setChatMode={setChatMode}
            isAnalyzing={isAnalyzing}
          />

          {/* SUBMIT BUTTON - Now positioned right after the mode selector */}
          <button 
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            className="flex w-10 h-10 justify-center items-center gap-2 rounded-xl bg-gradient-to-b from-[#E5E5E5] to-[#E2E2E2] shadow-[0px_3px_4px_-1px_rgba(0,0,0,0.15),0px_1px_0px_0px_rgba(255,255,255,0.33)_inset,0px_0px_0px_1px_#D4D4D4] hover:from-[#E0E0E0] hover:to-[#DDDDDD] transition-all disabled:opacity-50"
            style={{
              width: '40px',
              height: '40px'
            }}
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5 text-[#121212] flex-shrink-0" />
            )}
          </button>
        </div>
        
        {/* RIGHT SIDE CONTROLS */}
        <ActionButtons
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* URL INPUT SECTION (if active) */}
      {showUrlInput && (
        <div className="w-full p-3 bg-gray-50 rounded-xl border border-[#E2E2E2]">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-['Instrument_Sans'] text-[14px]"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddUrl();
                }
              }}
            />
            <Button onClick={onAddUrl} size="sm" disabled={!urlInput.trim()}>Add</Button>
            <Button onClick={onCancelUrl} variant="outline" size="sm">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};
