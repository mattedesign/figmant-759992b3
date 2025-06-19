
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface TemplateDropdownProps {
  showTemplateMenu: boolean;
  setShowTemplateMenu: (show: boolean) => void;
  selectedPromptTemplate: FigmantPromptTemplate | null;
  availableTemplates: FigmantPromptTemplate[];
  onTemplateSelect: (templateId: string) => void;
  isAnalyzing: boolean;
}

export const TemplateDropdown: React.FC<TemplateDropdownProps> = ({
  showTemplateMenu,
  setShowTemplateMenu,
  selectedPromptTemplate,
  availableTemplates,
  onTemplateSelect,
  isAnalyzing
}) => {
  return (
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
  );
};
