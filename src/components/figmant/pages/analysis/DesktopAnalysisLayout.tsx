
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { CollapsibleHistorySidebar } from './CollapsibleHistorySidebar';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { TemplatesSidebar } from './TemplatesSidebar';

interface DesktopAnalysisLayoutProps {
  onNewAnalysis: () => void;
  chatPanelProps: any;
  promptTemplates: any[];
  selectedPromptCategory: string;
  selectedPromptTemplate: string;
  onPromptCategoryChange: (category: string) => void;
  onPromptTemplateChange: (templateId: string) => void;
}

export const DesktopAnalysisLayout: React.FC<DesktopAnalysisLayoutProps> = ({
  onNewAnalysis,
  chatPanelProps,
  promptTemplates,
  selectedPromptCategory,
  selectedPromptTemplate,
  onPromptCategoryChange,
  onPromptTemplateChange
}) => {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Collapsible Analysis History Sidebar */}
      <CollapsibleHistorySidebar onNewAnalysis={onNewAnalysis} />

      {/* Main Chat Content - Centered */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header with Chat/Attachments tabs */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-6">
              <Button variant="ghost" className="text-gray-900 border-b-2 border-blue-500 rounded-none">
                Chat
              </Button>
              <Button variant="ghost" className="text-gray-500 rounded-none">
                Attachments
              </Button>
            </div>
          </div>
        </div>

        {/* Centered Chat Area */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-2xl h-full flex flex-col">
            {/* Design Analysis Header */}
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Design Analysis</h1>
              </div>
              <p className="text-gray-600">
                Start with a task, and let Figmant complete it for you. Not sure where to start? Try a template
              </p>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <AnalysisChatPanel {...chatPanelProps} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Templates Sidebar */}
      <TemplatesSidebar
        promptTemplates={promptTemplates}
        selectedPromptCategory={selectedPromptCategory}
        selectedPromptTemplate={selectedPromptTemplate}
        onPromptCategoryChange={onPromptCategoryChange}
        onPromptTemplateChange={onPromptTemplateChange}
      />
    </div>
  );
};
