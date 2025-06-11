
import React from 'react';
import { Button } from '@/components/ui/button';

interface URLInputProps {
  showUrlInput: boolean;
  urlInput: string;
  onUrlInputChange: (value: string) => void;
  onAddUrl: () => void;
  onCancel: () => void;
}

export const URLInput: React.FC<URLInputProps> = ({
  showUrlInput,
  urlInput,
  onUrlInputChange,
  onAddUrl,
  onCancel
}) => {
  if (!showUrlInput) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="url"
        placeholder="https://example.com"
        value={urlInput}
        onChange={(e) => onUrlInputChange(e.target.value)}
        className="flex-1 px-3 py-2 border rounded-md"
        onKeyPress={(e) => e.key === 'Enter' && onAddUrl()}
      />
      <Button onClick={onAddUrl} size="sm">
        Add
      </Button>
      <Button 
        onClick={onCancel} 
        variant="outline" 
        size="sm"
      >
        Cancel
      </Button>
    </div>
  );
};
