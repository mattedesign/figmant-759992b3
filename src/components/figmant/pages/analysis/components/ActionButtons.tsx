
import React from 'react';
import { Mic } from 'lucide-react';

interface ActionButtonsProps {
  isAnalyzing: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
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
    </div>
  );
};
