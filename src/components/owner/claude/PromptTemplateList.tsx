
import React from 'react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptTemplateCard } from './components/PromptTemplateCard';

interface PromptTemplateListProps {
  groupedTemplates: Record<string, ClaudePromptExample[]>;
}

const PromptTemplateList: React.FC<PromptTemplateListProps> = ({ groupedTemplates }) => {
  if (Object.keys(groupedTemplates).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No prompt templates found. Create your first template to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
            {category.replace('_', ' ')}
            <span className="text-sm text-muted-foreground">({templates.length})</span>
          </h3>
          <div className="grid gap-4">
            {templates.map((template) => (
              <PromptTemplateCard
                key={template.id}
                template={template}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptTemplateList;
