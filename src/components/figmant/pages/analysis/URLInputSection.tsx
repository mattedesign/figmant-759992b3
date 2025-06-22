
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, AlertCircle, Loader2 } from 'lucide-react';

interface URLInputSectionProps {
  urlInput: string;
  setUrlInput: (value: string) => void;
  onAddUrl: (url: string) => Promise<void>; // FIX: Direct function instead of complex handler
  onCancel: () => void;
}

export const URLInputSection: React.FC<URLInputSectionProps> = ({
  urlInput,
  setUrlInput,
  onAddUrl,
  onCancel
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      new URL(formattedUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddUrl = async () => {
    if (!isValidUrl(urlInput)) {
      return;
    }

    setIsAdding(true);
    
    try {
      // FIX: Use the passed onAddUrl function directly
      await onAddUrl(urlInput);
      
      // Clear input and close
      setUrlInput('');
      onCancel();
    } catch (error) {
      console.error('Error adding URL:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const canAdd = urlInput.trim() && isValidUrl(urlInput) && !isAdding;
  const showError = urlInput.trim() && !isValidUrl(urlInput);

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Add Website URL</span>
          {canAdd && (
            <Badge variant="secondary" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Valid URL
            </Badge>
          )}
          {showError && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Invalid URL
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/page or example.com"
            onKeyPress={(e) => e.key === 'Enter' && canAdd && handleAddUrl()}
            disabled={isAdding}
            className={`${canAdd ? 'border-green-300 focus:border-green-500' : showError ? 'border-red-300 focus:border-red-500' : ''}`}
          />
          <Button 
            onClick={handleAddUrl} 
            size="sm"
            disabled={!canAdd}
            className={canAdd ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isAdding ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              'Add'
            )}
          </Button>
          <Button variant="ghost" onClick={onCancel} size="sm" disabled={isAdding}>
            Cancel
          </Button>
        </div>
        {showError && (
          <p className="text-xs text-red-600">Please enter a valid URL (e.g., https://example.com or example.com)</p>
        )}
      </div>
    </div>
  );
};
