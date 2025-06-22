import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw,
  Info,
  Settings
} from 'lucide-react';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { useToast } from '@/hooks/use-toast';

interface ScreenshotServiceStatusProps {
  className?: string;
  showCompact?: boolean;
  showTitle?: boolean;
}

export const ScreenshotServiceStatus: React.FC<ScreenshotServiceStatusProps> = ({ 
  className,
  showCompact = false,
  showTitle = true
}) => {
  const [serviceStatus, setServiceStatus] = useState<{
    isWorking: boolean;
    provider: string;
    apiKeyStatus: string;
    error?: string;
    hasApiKey: boolean;
    setupInstructions?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const checkServiceStatus = async () => {
    setIsLoading(true);
    try {
      const status = await ScreenshotCaptureService.getServiceStatus();
      setServiceStatus(status);
      console.log('📊 SCREENSHOT STATUS - Service status:', status);
    } catch (error) {
      console.error('📊 SCREENSHOT STATUS - Failed to check status:', error);
      setServiceStatus({
        isWorking: false,
        provider: 'unknown',
        apiKeyStatus: 'error',
        hasApiKey: false,
        error: 'Failed to check service status'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testService = async () => {
    setIsTesting(true);
    try {
      const testResult = await ScreenshotCaptureService.captureScreenshot('https://example.com', {
        width: 400,
        height: 300,
        format: 'png'
      });
      
      if (testResult.success) {
        toast({
          title: "Service Test Successful",
          description: "ScreenshotOne API is working correctly!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Service Test Failed",
          description: testResult.error || "Unknown error occurred",
        });
      }
      
      await checkServiceStatus();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Service Test Error",
        description: error instanceof Error ? error.message : "Test failed",
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  if (showCompact && serviceStatus) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        {serviceStatus.isWorking && serviceStatus.hasApiKey ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Real Screenshots
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Mock Screenshots
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={checkServiceStatus}
          disabled={isLoading}
          className="h-6 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Screenshot Service Status
            <Button
              variant="ghost"
              size="sm"
              onClick={checkServiceStatus}
              disabled={isLoading}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {/* Service Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {isLoading ? (
            <Badge variant="secondary">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Checking...
            </Badge>
          ) : serviceStatus ? (
            serviceStatus.isWorking ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Working
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Not Working
              </Badge>
            )
          ) : (
            <Badge variant="secondary">Unknown</Badge>
          )}
        </div>

        {/* API Key Status */}
        {serviceStatus && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">API Key:</span>
            {serviceStatus.hasApiKey ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <XCircle className="h-3 w-3 mr-1" />
                Missing
              </Badge>
            )}
          </div>
        )}

        {/* Provider Information */}
        {serviceStatus && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Provider:</span>
            <Badge variant="outline">{serviceStatus.provider}</Badge>
          </div>
        )}

        {/* Error Message */}
        {serviceStatus?.error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{serviceStatus.error}</AlertDescription>
          </Alert>
        )}

        {/* Setup Instructions */}
        {serviceStatus && !serviceStatus.hasApiKey && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Setup Required:</p>
                <p>To enable high-quality screenshot capture, you need a ScreenshotOne API key.</p>
                <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
                  <li>Get an API key from ScreenshotOne</li>
                  <li>Add it as <code className="bg-gray-100 px-1 rounded">VITE_SCREENSHOTONE_API_KEY</code> environment variable</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" asChild>
            <a 
              href="https://screenshotone.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Get API Key
            </a>
          </Button>
          
          {serviceStatus?.hasApiKey && (
            <Button 
              variant="outline" 
              onClick={testService}
              disabled={isTesting}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              Test Service
            </Button>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-3 pt-2 border-t">
          <h4 className="text-sm font-semibold">Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>High-quality screenshots</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Mobile & desktop capture</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Ad & cookie banner blocking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Full-page capture</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
