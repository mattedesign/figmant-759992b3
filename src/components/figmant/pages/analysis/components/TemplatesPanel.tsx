
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';

interface TemplatesPanelProps {
  promptTemplates: ClaudePromptExample[];
  selectedPromptTemplate?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  promptTemplates,
  selectedPromptTemplate,
  onPromptTemplateSelect
}) => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Available Templates</h3>
        <p className="text-xs text-gray-500">Choose a template to get started with your analysis</p>
      </div>
      
      <div className="space-y-3">
        {promptTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPromptTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onPromptTemplateSelect?.(template.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{template.title}</CardTitle>
                {template.effectiveness_rating && template.effectiveness_rating > 8 && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Best
                  </Badge>
                )}
              </div>
              {template.description && (
                <CardDescription className="text-xs">
                  {template.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {template.category.replace('_', ' ')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPromptTemplateSelect?.(template.id);
                  }}
                >
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
