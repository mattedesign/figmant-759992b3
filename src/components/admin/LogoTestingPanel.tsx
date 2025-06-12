
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { testStorageAccess, testImageUrl } from '@/utils/logoTestUtils';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { useAssetManagement } from '@/hooks/useAssetManagement';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const LogoTestingPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { logoConfig } = useLogoConfig();
  const { getAssetsByType } = useAssetManagement();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Storage Access
      console.log('Running storage access test...');
      const storageResult = await testStorageAccess();
      results.push({
        name: 'Storage Access',
        status: storageResult.success ? 'success' : 'error',
        message: storageResult.success ? 'Storage is accessible' : storageResult.error || 'Storage access failed',
        details: storageResult
      });

      // Test 2: Active Logo URL
      console.log('Testing active logo URL...');
      const activeLogoTest = await testImageUrl(logoConfig.activeLogoUrl);
      results.push({
        name: 'Active Logo URL',
        status: activeLogoTest ? 'success' : 'error',
        message: activeLogoTest ? 'Active logo loads successfully' : 'Active logo failed to load',
        details: { url: logoConfig.activeLogoUrl }
      });

      // Test 3: Fallback Logo URL
      console.log('Testing fallback logo URL...');
      const fallbackLogoTest = await testImageUrl(logoConfig.fallbackLogoUrl);
      results.push({
        name: 'Fallback Logo URL',
        status: fallbackLogoTest ? 'success' : 'error',
        message: fallbackLogoTest ? 'Fallback logo loads successfully' : 'Fallback logo failed to load',
        details: { url: logoConfig.fallbackLogoUrl }
      });

      // Test 4: Asset Management
      const logoAssets = getAssetsByType('logo');
      results.push({
        name: 'Asset Management',
        status: logoAssets.length > 0 ? 'success' : 'warning',
        message: `Found ${logoAssets.length} logo assets`,
        details: { assets: logoAssets }
      });

      // Test 5: URL Consistency
      const hasSupabaseUrl = logoConfig.activeLogoUrl.includes('supabase');
      const hasLocalUrl = logoConfig.activeLogoUrl.startsWith('/');
      results.push({
        name: 'URL Configuration',
        status: hasSupabaseUrl ? 'success' : hasLocalUrl ? 'warning' : 'error',
        message: hasSupabaseUrl 
          ? 'Using Supabase storage URL' 
          : hasLocalUrl 
            ? 'Using local URL (may not persist)' 
            : 'Invalid URL format',
        details: { 
          activeUrl: logoConfig.activeLogoUrl,
          isSupabase: hasSupabaseUrl,
          isLocal: hasLocalUrl
        }
      });

    } catch (error) {
      console.error('Diagnostics error:', error);
      results.push({
        name: 'Diagnostics Error',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Pass</Badge>;
      case 'error':
        return <Badge variant="destructive">Fail</Badge>;
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Logo Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-2 flex-1">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-muted-foreground">{result.message}</div>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-blue-600">View Details</summary>
                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Current Active Logo:</strong> {logoConfig.activeLogoUrl}</div>
          <div><strong>Fallback Logo:</strong> {logoConfig.fallbackLogoUrl}</div>
        </div>
      </CardContent>
    </Card>
  );
};
