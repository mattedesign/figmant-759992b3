
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw,
  Info,
  Settings,
  Key,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { useToast } from '@/hooks/use-toast';

interface ScreenshotServiceSetupProps {
  className?: string;
}

export const ScreenshotServiceSetup: React.FC<ScreenshotServiceSetupProps> = ({ 
  className 
}) => {
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const checkServiceStatus = async () => {
    setIsLoading(true);
    try {
      const status = ScreenshotCaptureService.getServiceStatus();
      setServiceStatus(status);
      console.log('📊 SCREENSHOT SETUP - Service status:', status);
      
      // Show setup instructions if API key is missing
      if (!status.hasApiKey) {
        setShowSetupInstructions(true);
      }
    } catch (error) {
      console.error('📊 SCREENSHOT SETUP - Failed to check status:', error);
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

  const testScreenshotCapture = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 SCREENSHOT SETUP - Testing screenshot capture...');
      
      const result = await ScreenshotCaptureService.captureScreenshot('https://example.com', {
        width: 800,
        height: 600,
        format: 'png',
        mobile: false
      });
      
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Screenshot Test Successful",
          description: serviceStatus?.hasApiKey ? 
            "ScreenshotOne API is working correctly!" : 
            "Mock screenshot service is working correctly!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Screenshot Test Failed",
          description: result.error || "Unknown error occurred",
        });
      }
      
      // Refresh status after test
      await checkServiceStatus();
    } catch (error) {
      console.error('🧪 SCREENSHOT SETUP - Test failed:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Test failed'
      });
      
      toast({
        variant: "destructive",
        title: "Screenshot Test Error",
        description: error instanceof Error ? error.message : "Test failed",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Environment variable name copied",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy to clipboard",
      });
    }
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const getStatusBadge = () => {
    if (isLoading) {
      return (
        <Badge variant="secondary">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Checking...
        </Badge>
      );
    }
    
    if (!serviceStatus) return null;
    
    if (serviceStatus.isWorking && serviceStatus.hasApiKey) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Zap className="h-3 w-3 mr-1" />
          ScreenshotOne API Active
        </Badge>
      );
    } else if (!serviceStatus.hasApiKey) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Mock Service Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Service Error
        </Badge>
      );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          Screenshot Service Configuration
          <div className="ml-auto flex items-center gap-2">
            {getStatusBadge()}
            <Button
              variant="ghost"
              size="sm"
              onClick={checkServiceStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Current Status</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Service:</span>
              {serviceStatus ? (
                <Badge variant="outline">{serviceStatus.provider}</Badge>
              ) : (
                <Badge variant="secondary">Unknown</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">API Key:</span>
              {serviceStatus?.hasApiKey ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Key className="h-3 w-3 mr-1" />
                  Missing
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {showSetupInstructions && !serviceStatus?.hasApiKey && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium">Enable High-Quality Screenshots</p>
                
                <div className="space-y-2">
                  <p className="text-sm">
                    To enable real screenshot capture, you need a ScreenshotOne API key:
                  </p>
                  
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>
                      <a 
                        href="https://screenshotone.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Sign up for ScreenshotOne <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>Get your API key from the dashboard</li>
                    <li>Add it as an environment variable:</li>
                  </ol>
                  
                  <div className="bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">VITE_SCREENSHOTONE_API_KEY</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('VITE_SCREENSHOTONE_API_KEY')}
                        className="h-6 px-2"
                      >
                        {copied ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600">
                    After adding the API key, restart your development server to apply changes.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Service Error */}
        {serviceStatus?.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{serviceStatus.error}</AlertDescription>
          </Alert>
        )}

        {/* Test Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Service Test</h4>
            <Button 
              variant="outline" 
              onClick={testScreenshotCapture}
              disabled={isTesting}
              size="sm"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Test Screenshot
                </>
              )}
            </Button>
          </div>
          
          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-medium">
                    {testResult.success ? 'Test Successful' : 'Test Failed'}
                  </p>
                  <p className="text-sm">
                    {testResult.success 
                      ? `Screenshot captured successfully using ${serviceStatus?.hasApiKey ? 'ScreenshotOne API' : 'mock service'}`
                      : testResult.error || 'Unknown error occurred'
                    }
                  </p>
                  {testResult.success && testResult.screenshotUrl && (
                    <p className="text-xs text-gray-600">
                      Screenshot URL: {testResult.screenshotUrl}
                    </p>
                  )}
                </div>
              </div>
            </Alert>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-3 pt-2 border-t">
          <h4 className="text-sm font-semibold">
            {serviceStatus?.hasApiKey ? 'Active Features' : 'Available Features'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className={`h-4 w-4 flex-shrink-0 ${serviceStatus?.hasApiKey ? 'text-green-500' : 'text-gray-400'}`} />
              <span>High-quality screenshots</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className={`h-4 w-4 flex-shrink-0 ${serviceStatus?.hasApiKey ? 'text-green-500' : 'text-gray-400'}`} />
              <span>Mobile & desktop capture</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className={`h-4 w-4 flex-shrink-0 ${serviceStatus?.hasApiKey ? 'text-green-500' : 'text-gray-400'}`} />
              <span>Ad & cookie banner blocking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className={`h-4 w-4 flex-shrink-0 ${serviceStatus?.hasApiKey ? 'text-green-500' : 'text-gray-400'}`} />
              <span>Full-page capture</span>
            </div>
          </div>
        </div>

        {/* Fallback Notice */}
        {!serviceStatus?.hasApiKey && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800">Mock Service Active</p>
                <p className="text-xs text-blue-700">
                  Your application is currently using mock screenshots for testing. 
                  All functionality works normally, but screenshots are placeholder images. 
                  Add a ScreenshotOne API key to enable real website capture.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
