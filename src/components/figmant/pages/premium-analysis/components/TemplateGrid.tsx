
import React from 'react';
import { Search } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { TemplateCard } from './TemplateCard';

interface TemplateGridProps {
  templates: ClaudePromptExample[];
  selectedType: string;
  onTemplateSelect: (templateId: string, event?: React.MouseEvent) => void;
  onTemplatePreview: (template: ClaudePromptExample, event?: React.MouseEvent) => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  selectedType,
  onTemplateSelect,
  onTemplatePreview
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
        <p className="text-gray-600">
          Try adjusting your search query or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedType === template.id}
            onSelect={onTemplateSelect}
            onPreview={onTemplatePreview}
          />
        ))}
      </div>
    </div>
  );
};
