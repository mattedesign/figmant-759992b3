
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Camera, RefreshCw, Server, FileText } from 'lucide-react';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

interface ServiceStatus {
  apiKeySource: 'server' | 'environment' | 'none';
  isWorking: boolean;
  provider: string;
  error?: string;
  lastChecked: Date;
}

export const ScreenshotServiceDebugger: React.FC = () => {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkServiceStatus = async () => {
    setIsChecking(true);
    console.log('🔍 SCREENSHOT DEBUGGER - Checking service status...');
    
    try {
      const result = await ScreenshotCaptureService.testService();
      console.log('🔍 SCREENSHOT DEBUGGER - Service test result:', result);
      
      setStatus({
        ...result,
        apiKeySource: result.apiKeySource as 'server' | 'environment' | 'none',
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('🚨 SCREENSHOT DEBUGGER - Status check failed:', error);
      setStatus({
        isWorking: false,
        provider: 'error',
        apiKeySource: 'none',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      });
    }
    
    setIsChecking(false);
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const getStatusIcon = () => {
    if (!status) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (status.isWorking) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status.provider === 'MockScreenshotProvider') return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = () => {
    if (!status) return <Badge variant="secondary">Checking...</Badge>;
    if (status.isWorking && status.provider === 'ScreenshotOneProvider') return <Badge className="bg-green-100 text-green-800">ScreenshotOne Active</Badge>;
    if (status.provider === 'MockScreenshotProvider') return <Badge className="bg-yellow-100 text-yellow-800">Mock Service</Badge>;
    return <Badge variant="destructive">Service Error</Badge>;
  };

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

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4" />
          Screenshot Service Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          {getStatusIcon()}
          {getStatusBadge()}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkServiceStatus}
            disabled={isChecking}
          >
            {isChecking ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        </div>

        {status && (
          <>
            <div className="text-xs space-y-1">
              <div>Provider: <span className="font-mono">{status.provider}</span></div>
              <div className="flex items-center gap-2">
                <span>API Key:</span>
                <div className="flex items-center gap-1">
                  {getApiKeySourceIcon(status.apiKeySource)}
                  <span className="font-mono">{getApiKeySourceLabel(status.apiKeySource)}</span>
                </div>
              </div>
              <div>Last Checked: <span className="font-mono">{status.lastChecked.toLocaleTimeString()}</span></div>
            </div>

            {status.error && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">
                  Error: {status.error}
                </AlertDescription>
              </Alert>
            )}

            {status.provider === 'MockScreenshotProvider' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Using mock data. To use real screenshots, configure your ScreenshotOne API key via Supabase secrets or environment variables.
                </AlertDescription>
              </Alert>
            )}

            {!status.isWorking && status.apiKeySource === 'none' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  No ScreenshotOne API key found. Please configure it via Supabase secrets or add VITE_SCREENSHOTONE_API_KEY to your environment variables.
                </AlertDescription>
              </Alert>
            )}

            {status.apiKeySource === 'environment' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Using environment variable. For production, consider configuring via Supabase secrets for better security.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
