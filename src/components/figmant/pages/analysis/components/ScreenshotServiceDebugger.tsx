
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

export const ScreenshotServiceDebugger: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<any>(null);

  const testScreenshotService = async () => {
    setStatus('testing');
    setTestResult(null);

    try {
      console.log('🔧 DEBUGGER - Testing screenshot service');
      const testUrl = 'https://example.com';
      
      const result = await ScreenshotCaptureService.captureCompetitorSet(
        [testUrl],
        true, // desktop
        false // mobile only for test
      );

      console.log('🔧 DEBUGGER - Test result:', result);
      setTestResult(result);
      setStatus(result.desktop?.[0]?.success ? 'success' : 'error');
    } catch (error) {
      console.error('🔧 DEBUGGER - Test error:', error);
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
      setStatus('error');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'testing':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Testing</Badge>;
      case 'success':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Working</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  return (
    <Card className="p-3 mb-3 bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Screenshot Service Status</span>
          {getStatusBadge()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={testScreenshotService}
          disabled={status === 'testing'}
          className="h-7"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Test
        </Button>
      </div>

      {testResult && (
        <div className="text-xs space-y-1">
          {testResult.error ? (
            <p className="text-red-600">Error: {testResult.error}</p>
          ) : (
            <>
              <p className="text-green-600">
                Desktop: {testResult.desktop?.[0]?.success ? '✅ Success' : '❌ Failed'}
              </p>
              {testResult.desktop?.[0]?.screenshotUrl && (
                <p className="text-blue-600 truncate">
                  URL: {testResult.desktop[0].screenshotUrl.substring(0, 50)}...
                </p>
              )}
              {testResult.desktop?.[0]?.error && (
                <p className="text-red-600">
                  Error: {testResult.desktop[0].error}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
};
