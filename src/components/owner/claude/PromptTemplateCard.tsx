
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptTemplateItem } from './PromptTemplateItem';

interface PromptTemplateCardProps {
  category: {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  templates: ClaudePromptExample[];
}

export const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({ category, templates }) => {
  const Icon = category.icon;
  
  // Default handlers for PromptTemplateItem
  const handleView = (template: ClaudePromptExample) => {
    console.log('View template:', template.id);
  };
  
  const handleDelete = (template: ClaudePromptExample) => {
    console.log('Delete template:', template.id);
  };
  
  const handleEditSuccess = () => {
    console.log('Edit success - refresh needed');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Icon className="h-4 w-4" />
          <span>{category.label}</span>
          <Badge variant="secondary">{templates.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {templates.length === 0 ? (
          <p className="text-muted-foreground text-sm">No prompt templates in this category yet.</p>
        ) : (
          <div className="space-y-3">
            {templates.map(template => (
              <PromptTemplateItem 
                key={`template-${template.id}`} 
                template={template}
                onView={handleView}
                onDelete={handleDelete}
                onEditSuccess={handleEditSuccess}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
