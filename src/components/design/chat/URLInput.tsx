
import React from 'react';
import { DomainValidator } from './DomainValidator';

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

  const handleValidUrl = (validUrl: string) => {
    onUrlInputChange(validUrl);
    onAddUrl();
  };

  return (
    <div className="mb-4 p-4 border rounded-lg bg-background">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Add Website URL</h3>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Cancel
        </button>
      </div>
      
      <DomainValidator
        url={urlInput}
        onUrlChange={onUrlInputChange}
        onValidUrl={handleValidUrl}
      />
    </div>
  );
};
