
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
  console.log('🎯 SIMPLE TEMPLATE SELECTOR - Rendering with:', {
    selectedTemplateId: selectedTemplate?.id,
    availableTemplatesCount: availableTemplates.length,
    selectedTemplate
  });

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Select 
          value={selectedTemplate?.id || ''} 
          onValueChange={onTemplateSelect}
        >
          <SelectTrigger className="h-10">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
              <SelectValue placeholder="Select analysis template" className="truncate" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-[99999] relative">
            {availableTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{template.title || template.display_name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-60">
                      {template.description}
                    </div>
                  </div>
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
          className="h-10 w-10"
        >
          <Info className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
