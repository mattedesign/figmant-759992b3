
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, XCircle, AlertTriangle, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

interface ScreenshotOneConfigProps {
  className?: string;
}

interface ConfigStatus {
  configured: boolean;
  source?: string;
  error?: string;
  isWorking?: boolean;
  provider?: string;
}

export const ScreenshotOneConfig: React.FC<ScreenshotOneConfigProps> = ({ className }) => {
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({ configured: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  const checkConfiguration = async () => {
    setIsLoading(true);
    try {
      const status = await ScreenshotCaptureService.isConfigured();
      setConfigStatus(status);
    } catch (error) {
      setConfigStatus({ 
        configured: false, 
        error: error instanceof Error ? error.message : 'Configuration check failed' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testService = async () => {
    setIsTesting(true);
    try {
      const testResult = await ScreenshotCaptureService.testService();
      setConfigStatus(prev => ({
        ...prev,
        isWorking: testResult.isWorking,
        provider: testResult.provider,
        error: testResult.error || prev.error
      }));
    } catch (error) {
      setConfigStatus(prev => ({
        ...prev,
        isWorking: false,
        error: error instanceof Error ? error.message : 'Service test failed'
      }));
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  const getStatusBadge = () => {
    if (isLoading) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Checking...
        </Badge>
      );
    }

    if (configStatus.configured) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Configured ({configStatus.source})
        </Badge>
      );
    }

    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Not Configured
      </Badge>
    );
  };

  const getConfigurationAlert = () => {
    if (isLoading) return null;

    if (!configStatus.configured) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>ScreenshotOne API key not found. To enable high-quality screenshot capture:</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Add <code className="bg-gray-100 px-1 rounded">VITE_SCREENSHOTONE_API_KEY</code> to your environment variables, or</li>
                <li>Configure it in your Supabase project settings</li>
              </ul>
              {configStatus.error && (
                <p className="text-sm text-red-600 mt-2">Error: {configStatus.error}</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    if (configStatus.isWorking === false) {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Service configured but not working properly. {configStatus.error && `Error: ${configStatus.error}`}
          </AlertDescription>
        </Alert>
      );
    }

    if (configStatus.isWorking === true) {
      return (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            ScreenshotOne is ready! Competitor analysis will capture high-quality screenshots automatically using {configStatus.provider}.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          ScreenshotOne Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkConfiguration}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {configStatus.configured && (
              <Button
                variant="outline"
                size="sm"
                onClick={testService}
                disabled={isTesting}
              >
                <Loader2 className={`h-4 w-4 mr-1 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Testing...' : 'Test Service'}
              </Button>
            )}
          </div>
        </div>

        {getConfigurationAlert()}

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>High-quality screenshots</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Mobile & desktop capture</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Ad & cookie banner blocking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Full-page capture</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full" asChild>
            <a 
              href="https://screenshotone.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Get ScreenshotOne API Key
            </a>
          </Button>
        </div>

        {configStatus.configured && configStatus.source && (
          <div className="text-xs text-gray-500 text-center">
            Configuration source: {configStatus.source === 'environment' ? 'Environment variables' : 'Supabase'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
