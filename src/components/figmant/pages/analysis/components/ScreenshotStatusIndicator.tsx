
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Zap,
  Server,
  FileText,
  XCircle
} from 'lucide-react';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

interface ScreenshotStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const ScreenshotStatusIndicator: React.FC<ScreenshotStatusIndicatorProps> = ({
  showDetails = false,
  className = ''
}) => {
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const status = await ScreenshotCaptureService.getServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Failed to check screenshot service status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getApiKeySourceIcon = (source: string) => {
    switch (source) {
      case 'server': return <Server className="h-3 w-3" />;
      case 'environment': return <FileText className="h-3 w-3" />;
      default: return <XCircle className="h-3 w-3" />;
    }
  };

  const getApiKeySourceLabel = (source: string) => {
    switch (source) {
      case 'server': return 'Supabase Secrets';
      case 'environment': return 'Environment Variable';
      default: return 'Not Configured';
    }
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return (
        <Badge variant="secondary" className={className}>
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Checking...
        </Badge>
      );
    }
    
    if (!serviceStatus) return null;
    
    if (serviceStatus.isWorking && serviceStatus.hasApiKey) {
      return (
        <Badge variant="default" className={`bg-green-100 text-green-800 ${className}`}>
          <Zap className="h-3 w-3 mr-1" />
          Real Screenshots
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className={`bg-yellow-100 text-yellow-800 ${className}`}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          Mock Screenshots
        </Badge>
      );
    }
  };

  if (!showDetails) {
    return getStatusBadge();
  }

  // Detailed version with popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={`h-auto p-1 ${className}`}>
          {getStatusBadge()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Screenshot Service</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkStatus}
              disabled={isLoading}
              className="h-6 w-6 p-0 ml-auto"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Status:</span>
              {serviceStatus?.hasApiKey ? (
                <span className="text-green-600 font-medium">Real Screenshots</span>
              ) : (
                <span className="text-yellow-600 font-medium">Mock Screenshots</span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Provider:</span>
              <span className="font-mono text-xs">{serviceStatus?.provider || 'Unknown'}</span>
            </div>

            {serviceStatus?.hasApiKey && (
              <div className="flex items-center justify-between text-sm">
                <span>API Key Source:</span>
                <div className="flex items-center gap-1">
                  {getApiKeySourceIcon(serviceStatus.apiKeySource)}
                  <span className="font-mono text-xs">{getApiKeySourceLabel(serviceStatus.apiKeySource)}</span>
                </div>
              </div>
            )}
          </div>
          
          {!serviceStatus?.hasApiKey && (
            <div className="pt-2 border-t space-y-2">
              <p className="text-xs text-gray-600">
                Enable real screenshots by configuring your ScreenshotOne API key
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a 
                  href="https://screenshotone.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Get API Key
                </a>
              </Button>
            </div>
          )}

          {serviceStatus?.apiKeySource === 'environment' && (
            <div className="pt-2 border-t">
              <p className="text-xs text-orange-600">
                Using environment variable. Consider Supabase secrets for production.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
