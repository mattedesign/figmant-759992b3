
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface MessageTextAreaProps {
  message: string;
  setMessage: (message: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedPromptTemplate: FigmantPromptTemplate | null;
  chatMode: 'chat' | 'analyze';
  isAnalyzing: boolean;
}

export const MessageTextArea: React.FC<MessageTextAreaProps> = ({
  message,
  setMessage,
  onKeyPress,
  selectedPromptTemplate,
  chatMode,
  isAnalyzing
}) => {
  const getPlaceholder = () => {
    if (chatMode === 'analyze') {
      return selectedPromptTemplate 
        ? `Ask about your design using ${selectedPromptTemplate.displayName || selectedPromptTemplate.title}...`
        : "Ask me anything about your design...";
    }
    return "How can I help...";
  };

  return (
    <div className="flex p-2 items-start gap-2 self-stretch">
      <Textarea
        className="flex-1 overflow-hidden text-[#121212] text-ellipsis font-['Instrument_Sans'] text-[15px] font-normal leading-6 tracking-[-0.3px] border-none outline-none bg-transparent resize-none min-h-[24px] max-h-[96px]"
        placeholder={getPlaceholder()}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={isAnalyzing}
        rows={1}
      />
    </div>
  );
};
