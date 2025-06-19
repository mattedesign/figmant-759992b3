
import React from 'react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface MessageTextAreaProps {
  message: string;
  setMessage: (message: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedPromptTemplate: FigmantPromptTemplate | null;
  chatMode: 'chat' | 'analyze';
  isAnalyzing: boolean;
  placeholder: string;
}

export const MessageTextArea: React.FC<MessageTextAreaProps> = ({
  message,
  setMessage,
  onKeyPress,
  selectedPromptTemplate,
  chatMode,
  isAnalyzing,
  placeholder
}) => {
  const getContextualPlaceholder = () => {
    if (chatMode === 'chat') {
      return placeholder;
    }
    
    if (selectedPromptTemplate) {
      return `${selectedPromptTemplate.displayName || selectedPromptTemplate.title}: ${placeholder}`;
    }
    
    return placeholder;
  };

  return (
    <div className="flex p-2 items-start gap-2 self-stretch">
      <textarea
        className="flex-1 overflow-hidden text-[#121212] text-ellipsis font-['Instrument_Sans'] text-[15px] font-normal leading-6 tracking-[-0.3px] border-none outline-none bg-transparent resize-none min-h-[60px]"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 8,
        }}
        placeholder={getContextualPlaceholder()}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={isAnalyzing}
        rows={3}
      />
    </div>
  );
};
