
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { testStorageAccess, testImageUrl } from '@/utils/logoTestUtils';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';
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
  const { logoConfig } = usePublicLogoConfig();
  const { getAssetsByType } = useAssetManagement();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      console.log('=== LOGO DIAGNOSTICS START ===');

      // Test 1: Enhanced Storage Access
      console.log('Running enhanced storage access test...');
      const storageResult = await testStorageAccess();
      results.push({
        name: 'Storage Access',
        status: storageResult.success ? 'success' : 'error',
        message: storageResult.success 
          ? `Storage is accessible. Found ${storageResult.details?.filesFound || 0} logo files.`
          : storageResult.error || 'Storage access failed',
        details: storageResult
      });

      // Test 2: Active Logo URL
      console.log('Testing active logo URL accessibility...');
      const activeLogoTest = await testImageUrl(logoConfig.activeLogoUrl);
      results.push({
        name: 'Active Logo URL',
        status: activeLogoTest ? 'success' : 'error',
        message: activeLogoTest 
          ? 'Active logo loads successfully' 
          : 'Active logo failed to load',
        details: { 
          url: logoConfig.activeLogoUrl,
          isLocalAsset: logoConfig.activeLogoUrl.startsWith('/'),
          isSupabaseUrl: logoConfig.activeLogoUrl.includes('supabase')
        }
      });

      // Test 3: Fallback Logo URL
      console.log('Testing fallback logo URL accessibility...');
      const fallbackLogoTest = await testImageUrl(logoConfig.fallbackLogoUrl);
      results.push({
        name: 'Fallback Logo URL',
        status: fallbackLogoTest ? 'success' : 'error',
        message: fallbackLogoTest 
          ? 'Fallback logo loads successfully' 
          : 'Fallback logo failed to load',
        details: { 
          url: logoConfig.fallbackLogoUrl,
          isLocalAsset: logoConfig.fallbackLogoUrl.startsWith('/'),
          isSupabaseUrl: logoConfig.fallbackLogoUrl.includes('supabase')
        }
      });

      // Test 4: Asset Management
      const logoAssets = getAssetsByType('logo');
      results.push({
        name: 'Asset Management',
        status: logoAssets.length > 0 ? 'success' : 'warning',
        message: `Found ${logoAssets.length} logo assets in local cache`,
        details: { assets: logoAssets.map(asset => ({
          id: asset.id,
          name: asset.name,
          url: asset.url
        })) }
      });

      // Test 5: URL Configuration Analysis
      const activeUrl = logoConfig.activeLogoUrl;
      const hasSupabaseUrl = activeUrl.includes('supabase');
      const hasLocalUrl = activeUrl.startsWith('/');
      const isDefaultFallback = activeUrl === '/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png';
      
      let configStatus: 'success' | 'warning' | 'error' = 'error';
      let configMessage = 'Invalid URL format';
      
      if (isDefaultFallback) {
        configStatus = 'success';
        configMessage = 'Using default Figmant logo (local asset)';
      } else if (hasSupabaseUrl) {
        configStatus = 'success';
        configMessage = 'Using Supabase storage URL (recommended)';
      } else if (hasLocalUrl) {
        configStatus = 'warning';
        configMessage = 'Using local URL (may not persist across deployments)';
      }
      
      results.push({
        name: 'URL Configuration',
        status: configStatus,
        message: configMessage,
        details: { 
          activeUrl,
          isSupabase: hasSupabaseUrl,
          isLocal: hasLocalUrl,
          isDefault: isDefaultFallback,
          fallbackUrl: logoConfig.fallbackLogoUrl
        }
      });

      // Test 6: Configuration Consistency
      const hasPublicConfig = logoConfig.activeLogoUrl !== '/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png';
      results.push({
        name: 'Configuration Status',
        status: hasPublicConfig ? 'success' : 'warning',
        message: hasPublicConfig 
          ? 'Custom logo configuration is active' 
          : 'Using default configuration (no custom logo set)',
        details: {
          hasCustomConfig: hasPublicConfig,
          activeLogoUrl: logoConfig.activeLogoUrl,
          fallbackLogoUrl: logoConfig.fallbackLogoUrl
        }
      });

      console.log('=== LOGO DIAGNOSTICS COMPLETE ===');

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
          Enhanced Logo Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Enhanced Diagnostics...' : 'Run Enhanced Diagnostics'}
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
                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto max-h-32">
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

        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-lg">
          <div><strong>Current Active Logo:</strong> {logoConfig.activeLogoUrl}</div>
          <div><strong>Fallback Logo:</strong> {logoConfig.fallbackLogoUrl}</div>
          <div className="text-xs text-blue-600 mt-2">
            💡 Tip: If storage tests fail, you may need to run the storage configuration migration.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
