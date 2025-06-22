
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface URLInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUrl: (url: string) => Promise<void>;
}

export const URLInputModal: React.FC<URLInputModalProps> = ({
  isOpen,
  onClose,
  onAddUrl
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

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
    if (!isValidUrl(urlInput) || isAdding) {
      return;
    }

    setIsAdding(true);
    
    try {
      await onAddUrl(urlInput);
      setUrlInput('');
      onClose();
    } catch (error) {
      console.error('Error adding URL:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canAdd) {
      handleAddUrl();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const canAdd = urlInput.trim() && isValidUrl(urlInput) && !isAdding;
  const showError = urlInput.trim() && !isValidUrl(urlInput);

  return (
    <Card className="p-4 border bg-background animate-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Add Website URL</span>
          {canAdd && (
            <Badge variant="secondary" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          )}
          {showError && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          )}
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          disabled={isAdding}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com or example.com"
            onKeyDown={handleKeyPress}
            disabled={isAdding}
            className={`${
              canAdd ? 'border-green-300 focus:border-green-500' : 
              showError ? 'border-red-300 focus:border-red-500' : ''
            }`}
            autoFocus
          />
          <Button 
            onClick={handleAddUrl} 
            disabled={!canAdd}
            size="sm"
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
        </div>
        
        {showError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Please enter a valid URL (e.g., https://example.com or example.com)
          </p>
        )}
        
        {urlInput && canAdd && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Ready to add: {new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`).hostname}
          </p>
        )}
      </div>
    </Card>
  );
};
