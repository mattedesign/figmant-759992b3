
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange
}) => {
  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white min-w-0 w-32 flex-shrink-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
        <SelectItem value="claude-sonnet">Claude Sonnet</SelectItem>
        <SelectItem value="claude-haiku">Claude Haiku</SelectItem>
        <SelectItem value="claude-opus">Claude Opus</SelectItem>
      </SelectContent>
    </Select>
  );
};
