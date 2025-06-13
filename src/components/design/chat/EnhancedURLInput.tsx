
import React, { useState } from 'react';
import { DomainValidator } from './DomainValidator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EnhancedURLInputProps {
  showUrlInput: boolean;
  urlInput: string;
  onUrlInputChange: (value: string) => void;
  onAddUrl: () => void;
  onCancel: () => void;
  isValidating?: boolean;
  validationProgress?: number;
}

export const EnhancedURLInput: React.FC<EnhancedURLInputProps> = ({
  showUrlInput,
  urlInput,
  onUrlInputChange,
  onAddUrl,
  onCancel,
  isValidating = false,
  validationProgress = 0
}) => {
  const [urlStatus, setUrlStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  if (!showUrlInput) {
    return null;
  }

  const handleValidUrl = (validUrl: string) => {
    setUrlStatus('valid');
    onUrlInputChange(validUrl);
    onAddUrl();
  };

  const handleUrlChange = (url: string) => {
    onUrlInputChange(url);
    if (url.trim()) {
      setUrlStatus('validating');
      // Simulate validation delay
      setTimeout(() => {
        setUrlStatus(url.includes('.') ? 'valid' : 'invalid');
      }, 500);
    } else {
      setUrlStatus('idle');
    }
  };

  const getStatusIcon = () => {
    switch (urlStatus) {
      case 'validating':
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Globe className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (urlStatus) {
      case 'validating':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Validating...
          </Badge>
        );
      case 'valid':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Valid URL
          </Badge>
        );
      case 'invalid':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Invalid URL
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 border bg-background animate-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            {getStatusIcon()}
            Add Website URL
          </h3>
          {getStatusBadge()}
        </div>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
      
      {isValidating && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Validating URL and checking accessibility...</span>
          </div>
          <Progress value={validationProgress} className="h-1" />
        </div>
      )}
      
      <DomainValidator
        url={urlInput}
        onUrlChange={handleUrlChange}
        onValidUrl={handleValidUrl}
      />
    </Card>
  );
};
