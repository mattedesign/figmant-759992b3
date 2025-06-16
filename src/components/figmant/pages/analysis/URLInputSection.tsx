
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface URLInputSectionProps {
  urlInput: string;
  setUrlInput: (value: string) => void;
  onAddUrl: () => void;
  onCancel: () => void;
}

export const URLInputSection: React.FC<URLInputSectionProps> = ({
  urlInput,
  setUrlInput,
  onAddUrl,
  onCancel
}) => {
  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter website URL for analysis..."
          onKeyPress={(e) => e.key === 'Enter' && onAddUrl()}
        />
        <Button onClick={onAddUrl} size="sm">Add</Button>
        <Button variant="ghost" onClick={onCancel} size="sm">Cancel</Button>
      </div>
    </div>
  );
};
