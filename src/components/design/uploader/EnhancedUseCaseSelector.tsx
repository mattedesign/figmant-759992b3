
import React, { useState, useEffect } from 'react';
import { getFigmantTemplate } from '@/data/figmantPromptTemplates';
import { FigmantPromptTemplate, FigmantPromptVariables } from '@/types/figmant';
import { AnalysisFrameworkTabs } from './AnalysisFrameworkTabs';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';

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
  const { data: useCases = [] } = useDesignUseCases();

  // Map Figmant template names to database use case IDs
  const getFigmantUseCaseId = (templateId: string): string | null => {
    const template = getFigmantTemplate(templateId);
    if (!template) return null;
    
    // Find the corresponding use case in the database by name (now without "Figmant:" prefix)
    const useCase = useCases.find(uc => uc.name === template.name);
    return useCase?.id || null;
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = getFigmantTemplate(templateId);
    if (template) {
      setSelectedTemplate(template);
      
      // Get the actual database UUID for this template
      const useCaseId = getFigmantUseCaseId(templateId);
      if (useCaseId) {
        // Use the actual database UUID
        setSelectedUseCase(useCaseId);
      } else {
        // Fallback to the figmant_ prefix if not found in database yet
        setSelectedUseCase(`figmant_${templateId}`);
        console.warn(`Template "${template.name}" not found in database, using fallback ID`);
      }
    }
  };

  const handleVariableChange = (key: keyof FigmantPromptVariables, value: string | string[]) => {
    setPromptVariables({
      ...promptVariables,
      [key]: value
    });
  };

  // Update the selected use case when switching modes or when use cases data loads
  useEffect(() => {
    if (analysisMode === 'figmant' && selectedTemplate && useCases.length > 0) {
      const useCaseId = getFigmantUseCaseId(selectedTemplate.id);
      if (useCaseId && selectedUseCase !== useCaseId) {
        setSelectedUseCase(useCaseId);
      }
    }
  }, [analysisMode, selectedTemplate, useCases, setSelectedUseCase]);

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
