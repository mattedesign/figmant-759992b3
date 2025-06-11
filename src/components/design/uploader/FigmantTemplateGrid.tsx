
import React from 'react';
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';
import { FigmantTemplateCard } from './FigmantTemplateCard';
import { FigmantPromptTemplate } from '@/types/figmant';

interface FigmantTemplateGridProps {
  selectedTemplate: FigmantPromptTemplate | null;
  onTemplateSelect: (templateId: string) => void;
}

export const FigmantTemplateGrid = ({ selectedTemplate, onTemplateSelect }: FigmantTemplateGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {figmantPromptTemplates.map((template) => (
        <FigmantTemplateCard
          key={template.id}
          template={template}
          isSelected={selectedTemplate?.id === template.id}
          onSelect={onTemplateSelect}
        />
      ))}
    </div>
  );
};
