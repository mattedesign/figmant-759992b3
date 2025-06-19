
import React from 'react';
import { Mic, ArrowUp } from 'lucide-react';

interface ActionButtonsProps {
  onSendMessage: () => void;
  canSend: boolean;
  isAnalyzing: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSendMessage,
  canSend,
  isAnalyzing
}) => {
  return (
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
          <ArrowUp className="w-5 h-5 text-[#121212] flex-shrink-0" />
        )}
      </button>
    </div>
  );
};
