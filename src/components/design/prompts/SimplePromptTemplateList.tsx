
import React from 'react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { PromptTemplateItem } from '@/components/owner/claude/PromptTemplateItem';

export const SimplePromptTemplateList = () => {
  const { data: templates = [], refetch } = useClaudePromptExamples();

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No prompt templates found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompt Templates</h2>
          <p className="text-muted-foreground">
            Manage and edit analysis prompt templates with inline editing
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {templates.map(template => (
          <PromptTemplateItem
            key={template.id}
            template={template}
            onView={() => {}} // placeholder - functionality can be added later if needed
            onDelete={() => {}} // placeholder - functionality can be added later if needed  
            onEditSuccess={refetch}
          />
        ))}
      </div>
    </div>
  );
};
