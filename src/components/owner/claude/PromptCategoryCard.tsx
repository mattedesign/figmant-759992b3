
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptExampleCard } from './PromptExampleCard';

interface PromptCategoryCardProps {
  category: {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  prompts: ClaudePromptExample[];
}

export const PromptCategoryCard: React.FC<PromptCategoryCardProps> = ({ category, prompts }) => {
  const Icon = category.icon;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Icon className="h-4 w-4" />
          <span>{category.label}</span>
          <Badge variant="secondary">{prompts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No prompts in this category yet.</p>
        ) : (
          <div className="space-y-3">
            {prompts.map(prompt => (
              <PromptExampleCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
