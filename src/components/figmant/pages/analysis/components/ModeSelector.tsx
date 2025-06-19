
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ModeSelectorProps {
  showModeMenu: boolean;
  setShowModeMenu: (show: boolean) => void;
  chatMode: 'chat' | 'analyze';
  setChatMode: (mode: 'chat' | 'analyze') => void;
  isAnalyzing: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  showModeMenu,
  setShowModeMenu,
  chatMode,
  setChatMode,
  isAnalyzing
}) => {
  return (
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
        <div className="absolute bottom-full right-0 mb-2 flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-50 w-64">
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
  );
};
