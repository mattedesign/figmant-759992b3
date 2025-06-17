
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

interface AnalysisTemplateSelectorProps {
  figmantTemplates: any[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onViewTemplate: (template: any) => void;
  getCurrentTemplate: () => any;
}

export const AnalysisTemplateSelector: React.FC<AnalysisTemplateSelectorProps> = ({
  figmantTemplates,
  selectedTemplate,
  onTemplateSelect,
  onViewTemplate,
  getCurrentTemplate
}) => {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Analysis Template
        </label>
        <Select value={selectedTemplate} onValueChange={onTemplateSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select analysis template" />
          </SelectTrigger>
          <SelectContent>
            {figmantTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{template.display_name}</div>
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
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onViewTemplate(getCurrentTemplate())}
        title="View template details"
        className="mt-6"
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
};
