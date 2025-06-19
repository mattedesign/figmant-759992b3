
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface SimplePromptTemplateSelectorProps {
  availableTemplates: FigmantPromptTemplate[];
  selectedTemplate: FigmantPromptTemplate | null;
  onTemplateSelect: (templateId: string) => void;
  onViewTemplate: (template: FigmantPromptTemplate) => void;
}

export const SimplePromptTemplateSelector: React.FC<SimplePromptTemplateSelectorProps> = ({
  availableTemplates,
  selectedTemplate,
  onTemplateSelect,
  onViewTemplate
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Analysis Template
        </label>
        <Select 
          value={selectedTemplate?.id || ''} 
          onValueChange={onTemplateSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select analysis template" />
          </SelectTrigger>
          <SelectContent>
            {availableTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{template.displayName || template.title}</div>
                    {template.description && (
                      <div className="text-xs text-muted-foreground truncate max-w-60">
                        {template.description}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {template.category}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedTemplate && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onViewTemplate(selectedTemplate)}
          title="View template details"
          className="mt-6"
        >
          <Info className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
