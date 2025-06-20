
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Info, Sparkles } from 'lucide-react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';

interface SimpleTemplateSelectorProps {
  selectedTemplate?: any;
  onTemplateSelect: (templateId: string) => void;
  onViewTemplate: (template: any) => void;
}

export const SimpleTemplateSelector: React.FC<SimpleTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onViewTemplate
}) => {
  const { data: availableTemplates = [], isLoading } = useClaudePromptExamples();

  console.log('🎯 SIMPLE TEMPLATE SELECTOR - Rendering with:', {
    selectedTemplateId: selectedTemplate?.id,
    availableTemplatesCount: availableTemplates.length,
    selectedTemplate,
    isLoading
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 min-w-0">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 min-w-0">
        <Select 
          value={selectedTemplate?.id || ''} 
          onValueChange={onTemplateSelect}
        >
          <SelectTrigger className="h-10 w-full bg-white">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
              <SelectValue placeholder="Select analysis template" className="truncate" />
            </div>
          </SelectTrigger>
          <SelectContent 
            className="bg-white border border-gray-200 shadow-lg z-[100]"
            position="popper"
            sideOffset={4}
          >
            {availableTemplates.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No templates available. Contact admin to add templates.
              </div>
            ) : (
              availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id} className="cursor-pointer bg-white hover:bg-gray-50">
                  <div className="flex flex-col gap-1 py-1">
                    <div className="font-medium text-sm">{template.display_name || template.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-60">
                      {template.description}
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      {selectedTemplate && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onViewTemplate(selectedTemplate)}
          title="View template details"
          className="h-10 w-10 flex-shrink-0"
        >
          <Info className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
