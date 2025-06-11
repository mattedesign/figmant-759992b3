
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';

interface PromptExampleCardProps {
  prompt: ClaudePromptExample;
}

export const PromptExampleCard: React.FC<PromptExampleCardProps> = ({ prompt }) => {
  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{prompt.title}</h4>
        <div className="flex items-center space-x-2">
          {prompt.effectiveness_rating && (
            <Badge variant="outline">
              ⭐ {prompt.effectiveness_rating}/5
            </Badge>
          )}
          {prompt.is_template && (
            <Badge variant="secondary">Template</Badge>
          )}
        </div>
      </div>
      {prompt.description && (
        <p className="text-sm text-muted-foreground">{prompt.description}</p>
      )}
      <div className="text-xs text-muted-foreground">
        {prompt.use_case_context && `Use Case: ${prompt.use_case_context}`}
        {prompt.business_domain && ` | Domain: ${prompt.business_domain}`}
      </div>
    </div>
  );
};
