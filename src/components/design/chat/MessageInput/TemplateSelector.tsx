
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <Select value={selectedTemplate} onValueChange={onTemplateChange}>
      <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white min-w-0 flex-1 max-w-[200px]">
        <div className="flex items-center gap-2 min-w-0">
          <Zap className="h-4 w-4 text-green-500 flex-shrink-0" />
          <SelectValue placeholder="Prompt Template" className="truncate" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
        <SelectItem value="competitor">Competitor Analysis</SelectItem>
        <SelectItem value="revenue">Revenue Impact</SelectItem>
        <SelectItem value="testing">A/B Testing</SelectItem>
        <SelectItem value="messaging">Copy Testing</SelectItem>
        <SelectItem value="hierarchy">Visual Hierarchy</SelectItem>
      </SelectContent>
    </Select>
  );
};
