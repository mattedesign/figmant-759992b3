import React from 'react';
import { Plus, Camera, Globe, Video } from 'lucide-react';

interface AttachmentMenuProps {
  showAttachmentMenu: boolean;
  setShowAttachmentMenu: (show: boolean) => void;
  onAttachmentAction: (type: 'screenshot' | 'link' | 'camera') => void;
  isAnalyzing: boolean;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  showAttachmentMenu,
  setShowAttachmentMenu,
  onAttachmentAction,
  isAnalyzing
}) => {
  return (
    <div className="relative">
      <button 
        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
        className="flex w-11 h-11 justify-center items-center rounded-xl border border-[#E2E2E2] hover:bg-gray-50 transition-colors"
        disabled={isAnalyzing}
      >
        <Plus className="w-4 h-4" />
      </button>
      
      {showAttachmentMenu && (
        <div className="absolute bottom-full left-0 mb-2 flex flex-col gap-1 p-2 rounded-xl border border-[#E2E2E2] bg-[#FCFCFC] shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13)] backdrop-blur-md z-20">
          <button 
            onClick={() => onAttachmentAction('screenshot')}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Add Screenshots</span>
          </button>
          <button 
            onClick={() => onAttachmentAction('link')}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Add A Link</span>
          </button>
          <button 
            onClick={() => onAttachmentAction('camera')}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span className="font-['Instrument_Sans'] text-[14px] font-medium leading-5 tracking-[-0.14px] text-[#121212]">Use Camera</span>
          </button>
        </div>
      )}
    </div>
  );
};
