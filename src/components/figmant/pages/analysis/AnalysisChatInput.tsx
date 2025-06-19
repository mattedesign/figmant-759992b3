
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Camera, Globe, Video, Mic, Send, ChevronDown, FileText, X } from 'lucide-react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      e.target.value = '';
    }
  };

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

  const getPlaceholder = () => {
    if (chatMode === 'analyze') {
      return selectedPromptTemplate 
        ? `Ask about your design using ${selectedPromptTemplate.displayName || selectedPromptTemplate.title}...`
        : "Ask me anything about your design...";
    }
    return "How can I help...";
  };

  return (
    <div className="flex flex-col items-start gap-6 p-3 rounded-3xl border border-[#ECECEC] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13),0px_2px_0px_0px_#FFF_inset,0px_8px_16px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md lg:gap-6 md:gap-4 sm:gap-3 sm:p-2">
      
      {/* ATTACHMENT DISPLAY SECTION */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 w-full">
          {attachments.map((attachment) => (
            <Badge
              key={attachment.id}
              variant="secondary"
              className="flex items-center gap-2 px-3 py-2"
            >
              {attachment.type === 'file' ? (
                attachment.file?.type.startsWith('image/') ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              <span className="text-sm truncate max-w-[150px]">
                {attachment.name}
              </span>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* TEXT INPUT AREA */}
      <div className="flex p-2 items-start gap-2 self-stretch">
        <Textarea
          className="flex-1 overflow-hidden text-[#121212] text-ellipsis font-['Instrument_Sans'] text-[15px] font-normal leading-6 tracking-[-0.3px] border-none outline-none bg-transparent resize-none min-h-[24px] max-h-[192px]"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 8,
          }}
          placeholder={getPlaceholder()}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={isAnalyzing}
        />
      </div>

      {/* ACTIONS BAR */}
      <div className="flex justify-between items-center self-stretch sm:flex-col sm:gap-3 sm:items-stretch">
        
        {/* LEFT SIDE CONTROLS */}
        <div className="flex items-center gap-3 sm:justify-between sm:w-full">
          
          {/* EXPANDABLE PLUS BUTTON */}
          <div className="relative">
            <button 
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="flex h-10 px-[10px] py-1 items-center gap-3 rounded-xl border border-[#E2E2E2] hover:bg-gray-50 transition-colors sm:h-12 sm:px-3"
              disabled={isAnalyzing}
            >
              <Plus className="w-4 h-4" />
            </button>
            
            {showAttachmentMenu && (
              <div className="absolute bottom-full left-0 mb-2 flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-20">
                <button 
                  onClick={() => handleAttachmentAction('screenshot')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Add Screenshots</span>
                </button>
                <button 
                  onClick={() => handleAttachmentAction('link')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Add A Link</span>
                </button>
                <button 
                  onClick={() => handleAttachmentAction('camera')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Use Camera</span>
                </button>
              </div>
            )}
          </div>

          {/* TEMPLATE DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
              className="flex h-10 px-[10px] py-1 items-center gap-3 rounded-xl border border-[#E2E2E2] hover:bg-gray-50 transition-colors sm:h-12 sm:px-3"
              disabled={isAnalyzing}
            >
              <div className="flex p-[2px] items-center gap-2 w-4 h-4">
                <span className="text-lg">⚡</span>
              </div>
              <span className="text-[#121212] font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px]">
                {selectedPromptTemplate?.displayName || selectedPromptTemplate?.title || 'Template Name'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showTemplateMenu && (
              <div className="absolute top-full left-0 mt-2 min-w-[200px] flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-20">
                {availableTemplates.map((template) => (
                  <button 
                    key={template.id}
                    onClick={() => {
                      onTemplateSelect(template.id);
                      setShowTemplateMenu(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-lg">⚡</span>
                    <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">
                      {template.displayName || template.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MODE SELECTOR */}
          <div className="relative">
            <button 
              onClick={() => setShowModeMenu(!showModeMenu)}
              className="flex px-3 py-[10px] items-center gap-3 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isAnalyzing}
            >
              <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">
                {chatMode === 'chat' ? 'Chat' : 'Analyse'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showModeMenu && (
              <div className="absolute top-full right-0 mt-2 flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-20">
                <button 
                  onClick={() => { setChatMode('chat'); setShowModeMenu(false); }}
                  className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-['Instrument_Sans'] text-[14px] font-medium">Chat</span>
                  <p className="font-['Instrument_Sans'] text-[12px] text-gray-600">Ask questions or interact without getting an analysis</p>
                </button>
                <button 
                  onClick={() => { setChatMode('analyze'); setShowModeMenu(false); }}
                  className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-['Instrument_Sans'] text-[14px] font-medium">Analyse</span>
                  <p className="font-['Instrument_Sans'] text-[12px] text-gray-600">Get analysis on your files or content provided</p>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* RIGHT SIDE CONTROLS */}
        <div className="flex items-center gap-3 sm:justify-center">
          {/* MICROPHONE BUTTON */}
          <button 
            className="flex h-10 px-[10px] py-1 items-center gap-3 rounded-xl hover:bg-gray-50 transition-colors sm:h-12 sm:px-3"
            disabled={isAnalyzing}
          >
            <Mic className="w-5 h-5 text-[#7B7B7B]" />
          </button>
          
          {/* SUBMIT BUTTON */}
          <button 
            onClick={onSendMessage}
            disabled={!canSend || isAnalyzing}
            className="flex w-10 h-10 px-8 py-3 justify-center items-center gap-2 rounded-xl bg-gradient-to-b from-[#E5E5E5] to-[#E2E2E2] shadow-[0px_3px_4px_-1px_rgba(0,0,0,0.15),0px_1px_0px_0px_rgba(255,255,255,0.33)_inset,0px_0px_0px_1px_#D4D4D4] hover:from-[#E0E0E0] hover:to-[#DDDDDD] transition-all disabled:opacity-50 sm:w-12 sm:h-12"
            style={{
              width: '40px',
              height: '40px',
              padding: '12px 32px',
              borderRadius: '12px'
            }}
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-[#121212] flex-shrink-0" />
            )}
          </button>
        </div>
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
