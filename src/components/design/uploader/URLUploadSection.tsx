
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, X, Plus } from 'lucide-react';

interface URLUploadSectionProps {
  urls: string[];
  setUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
}

export const URLUploadSection = ({
  urls,
  setUrls
}: URLUploadSectionProps) => {
  const addUrlField = () => {
    setUrls(prev => [...prev, '']);
  };

  const removeUrlField = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    setUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  const validUrls = urls.filter(url => url.trim() !== '');

  // Helper function to safely get hostname from URL
  const getHostname = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      // If URL is invalid, just return the URL as-is (truncated if too long)
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Website URLs to Analyze</Label>
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="https://example.com/page"
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
            />
            {urls.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeUrlField(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={addUrlField}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another URL
        </Button>
      </div>

      {/* Valid URLs Summary */}
      {validUrls.length > 0 && (
        <div className="space-y-2">
          <Label>Valid URLs ({validUrls.length})</Label>
          <div className="flex flex-wrap gap-2">
            {validUrls.map((url, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                <Globe className="h-3 w-3 mr-1" />
                {getHostname(url)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
