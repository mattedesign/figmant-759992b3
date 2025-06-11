
import React, { useState } from 'react';
import { getFigmantTemplate } from '@/data/figmantPromptTemplates';
import { FigmantPromptTemplate, FigmantPromptVariables } from '@/types/figmant';
import { AnalysisFrameworkTabs } from './AnalysisFrameworkTabs';

interface EnhancedUseCaseSelectorProps {
  selectedUseCase: string;
  setSelectedUseCase: (value: string) => void;
  promptVariables: FigmantPromptVariables;
  setPromptVariables: (value: FigmantPromptVariables) => void;
  customInstructions: string;
  setCustomInstructions: (value: string) => void;
}

export const EnhancedUseCaseSelector = ({
  selectedUseCase,
  setSelectedUseCase,
  promptVariables,
  setPromptVariables,
  customInstructions,
  setCustomInstructions
}: EnhancedUseCaseSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<FigmantPromptTemplate | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'standard' | 'figmant'>('figmant');

  const handleTemplateSelect = (templateId: string) => {
    const template = getFigmantTemplate(templateId);
    if (template) {
      setSelectedTemplate(template);
      setSelectedUseCase(`figmant_${templateId}`);
    }
  };

  const handleVariableChange = (key: keyof FigmantPromptVariables, value: string | string[]) => {
    setPromptVariables({
      ...promptVariables,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <AnalysisFrameworkTabs
        analysisMode={analysisMode}
        setAnalysisMode={setAnalysisMode}
        selectedUseCase={selectedUseCase}
        setSelectedUseCase={setSelectedUseCase}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
        promptVariables={promptVariables}
        onVariableChange={handleVariableChange}
        customInstructions={customInstructions}
        onCustomInstructionsChange={setCustomInstructions}
      />
    </div>
  );
};
