
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Info, Sparkles } from 'lucide-react';

interface SimpleTemplateSelectorProps {
  selectedTemplate?: any;
  onTemplateSelect: (templateId: string) => void;
  availableTemplates: any[];
  onViewTemplate: (template: any) => void;
}

export const SimpleTemplateSelector: React.FC<SimpleTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  availableTemplates,
  onViewTemplate
}) => {
  const currentTemplate = selectedTemplate || availableTemplates[0];

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <Select 
          value={currentTemplate?.id || ''} 
          onValueChange={onTemplateSelect}
        >
          <SelectTrigger className="border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 flex-1">
            <SelectValue placeholder="Select analysis template" />
          </SelectTrigger>
          <SelectContent className="w-full min-w-[300px]">
            {availableTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id} className="w-full">
                <div className="w-full text-left">
                  <div className="font-medium text-left">{template.display_name || template.displayName}</div>
                  <div className="text-xs text-muted-foreground text-left whitespace-normal">
                    {template.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentTemplate && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onViewTemplate(currentTemplate)}
          title="View template details"
        >
          <Info className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
