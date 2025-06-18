
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

export const ScreenshotOneTest: React.FC = () => {
  const [testUrl, setTestUrl] = useState('https://example.com');
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    screenshotUrl?: string;
  } | null>(null);

  const testScreenshotAPI = async () => {
    if (!testUrl.trim()) return;

    setIsTestingAPI(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing ScreenshotOne API with:', testUrl);
      
      const result = await ScreenshotCaptureService.captureScreenshot(testUrl, {
        width: 1200,
        height: 800,
        fullPage: false,
        format: 'png',
        quality: 90
      });

      if (result.success) {
        setTestResult({
          success: true,
          message: 'Screenshot captured successfully!',
          screenshotUrl: result.screenshotUrl
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || 'Screenshot capture failed'
        });
      }
    } catch (error) {
      console.error('Screenshot test failed:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setIsTestingAPI(false);
    }
  };

  const apiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          ScreenshotOne API Test
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">API Status:</span>
          {apiKey ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              API Key Found
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              No API Key
            </Badge>
          )}
        </div>

        {apiKey && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Test URL:</label>
              <Input
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <Button 
              onClick={testScreenshotAPI}
              disabled={isTestingAPI || !testUrl.trim()}
              className="w-full"
            >
              {isTestingAPI ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Capturing Screenshot...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Test Screenshot Capture
                </>
              )}
            </Button>

            {testResult && (
              <div className={`p-3 rounded ${
                testResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.message}
                  </span>
                </div>
                
                {testResult.screenshotUrl && (
                  <div className="text-xs text-gray-600">
                    Screenshot URL: {testResult.screenshotUrl.substring(0, 50)}...
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
