
import React from 'react';
import { Button } from '@/components/ui/button';

interface URLInputSectionProps {
  showUrlInput: boolean;
  urlInput: string;
  setUrlInput: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
}

export const URLInputSection: React.FC<URLInputSectionProps> = ({
  showUrlInput,
  urlInput,
  setUrlInput,
  onAddUrl,
  onCancelUrl
}) => {
  if (!showUrlInput) return null;

  return (
    <div className="w-full p-3 bg-gray-50 rounded-xl border border-[#E2E2E2]">
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter website URL..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-['Instrument_Sans'] text-[14px]"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddUrl();
            }
          }}
        />
        <Button onClick={onAddUrl} size="sm" disabled={!urlInput.trim()}>Add</Button>
        <Button onClick={onCancelUrl} variant="outline" size="sm">Cancel</Button>
      </div>
    </div>
  );
};
