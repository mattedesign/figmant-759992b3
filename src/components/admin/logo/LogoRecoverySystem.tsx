
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { testImageUrl } from '@/utils/logoTestUtils';
import { supabase } from '@/integrations/supabase/client';

export const LogoRecoverySystem: React.FC = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'testing' | 'recovering' | 'complete'>('idle');
  const [testResults, setTestResults] = useState<{
    activeLogoAccessible: boolean | null;
    fallbackLogoAccessible: boolean | null;
    storageAccessible: boolean | null;
  }>({
    activeLogoAccessible: null,
    fallbackLogoAccessible: null,
    storageAccessible: null
  });

  const { toast } = useToast();
  const { logoConfig, updateActiveLogo, resetToDefault, reload } = useLogoConfig();

  const runDiagnostics = async () => {
    setRecoveryStatus('testing');
    console.log('=== LOGO RECOVERY DIAGNOSTICS START ===');

    try {
      // Test active logo URL
      console.log('Testing active logo URL:', logoConfig.activeLogoUrl);
      const activeLogoTest = await testImageUrl(logoConfig.activeLogoUrl);
      
      // Test fallback logo URL
      console.log('Testing fallback logo URL:', logoConfig.fallbackLogoUrl);
      const fallbackLogoTest = await testImageUrl(logoConfig.fallbackLogoUrl);

      // Test storage accessibility
      console.log('Testing storage accessibility...');
      let storageTest = false;
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (!error && buckets) {
          const designUploadsBucket = buckets.find(bucket => bucket.id === 'design-uploads');
          storageTest = !!designUploadsBucket;
        }
      } catch (error) {
        console.error('Storage test failed:', error);
        storageTest = false;
      }

      setTestResults({
        activeLogoAccessible: activeLogoTest,
        fallbackLogoAccessible: fallbackLogoTest,
        storageAccessible: storageTest
      });

      console.log('Diagnostics complete:', {
        activeLogoAccessible: activeLogoTest,
        fallbackLogoAccessible: fallbackLogoTest,
        storageAccessible: storageTest
      });

      setRecoveryStatus('complete');

      toast({
        title: "Diagnostics Complete",
        description: `Active logo: ${activeLogoTest ? 'OK' : 'Failed'}, Fallback: ${fallbackLogoTest ? 'OK' : 'Failed'}, Storage: ${storageTest ? 'OK' : 'Failed'}`,
      });

    } catch (error) {
      console.error('Diagnostics failed:', error);
      toast({
        variant: "destructive",
        title: "Diagnostics Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      setRecoveryStatus('idle');
    }
  };

  const performRecovery = async () => {
    setIsRecovering(true);
    setRecoveryStatus('recovering');
    console.log('=== LOGO RECOVERY START ===');

    try {
      // If active logo is broken but fallback works, reset to fallback
      if (!testResults.activeLogoAccessible && testResults.fallbackLogoAccessible) {
        console.log('Resetting to fallback logo...');
        await resetToDefault();
        
        toast({
          title: "Logo Reset to Fallback",
          description: "The active logo was inaccessible and has been reset to the fallback logo.",
        });
      }
      // If both are broken, try to upload a new default logo
      else if (!testResults.activeLogoAccessible && !testResults.fallbackLogoAccessible) {
        console.log('Both logos broken, attempting to create new default...');
        
        // Try to upload the default fallback logo to storage
        const { data: { user } } = await supabase.auth.getUser();
        if (user && testResults.storageAccessible) {
          try {
            // Create a simple SVG logo as bytes
            const svgContent = `
              <svg width="150" height="40" viewBox="0 0 150 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="150" height="40" rx="8" fill="#2563eb"/>
                <text x="75" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">FIGMANT</text>
                <circle cx="25" cy="15" r="2" fill="#10b981"/>
                <circle cx="30" cy="15" r="2" fill="#3b82f6"/>
                <circle cx="35" cy="15" r="2" fill="#8b5cf6"/>
              </svg>
            `;
            
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const file = new File([blob], 'default-logo.svg', { type: 'image/svg+xml' });
            
            const filePath = `${user.id}/assets/branding/logo/default-logo.svg`;
            
            const { error: uploadError } = await supabase.storage
              .from('design-uploads')
              .upload(filePath, file, { upsert: true });

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('design-uploads')
                .getPublicUrl(filePath);

              if (urlData?.publicUrl) {
                await updateActiveLogo(urlData.publicUrl);
                
                toast({
                  title: "Logo Recovered",
                  description: "A new default logo has been created and uploaded.",
                });
              }
            } else {
              throw new Error('Failed to upload recovery logo');
            }
          } catch (uploadError) {
            console.error('Failed to upload recovery logo:', uploadError);
            await resetToDefault();
            
            toast({
              title: "Partial Recovery",
              description: "Could not upload new logo, but reset to system default.",
            });
          }
        } else {
          await resetToDefault();
          
          toast({
            title: "Reset to System Default",
            description: "Logo configuration has been reset to system defaults.",
          });
        }
      }
      // If active logo works, no recovery needed
      else if (testResults.activeLogoAccessible) {
        toast({
          title: "No Recovery Needed",
          description: "Active logo is working correctly.",
        });
      }

      // Reload logo configuration
      await reload();
      
      // Re-run diagnostics to verify recovery
      await runDiagnostics();

      console.log('=== LOGO RECOVERY COMPLETE ===');

    } catch (error) {
      console.error('Recovery failed:', error);
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: error instanceof Error ? error.message : 'Recovery process failed',
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />;
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Testing...</Badge>;
    return status ? <Badge variant="default" className="bg-green-500">OK</Badge> : <Badge variant="destructive">Failed</Badge>;
  };

  const needsRecovery = testResults.activeLogoAccessible === false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Logo Recovery System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={runDiagnostics} 
            disabled={recoveryStatus === 'testing'}
            variant="outline"
            className="flex-1"
          >
            {recoveryStatus === 'testing' ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Run Diagnostics
          </Button>
          
          {needsRecovery && recoveryStatus === 'complete' && (
            <Button 
              onClick={performRecovery} 
              disabled={isRecovering}
              className="flex-1"
            >
              {isRecovering ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Recover Logo
            </Button>
          )}
        </div>

        {recoveryStatus !== 'idle' && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Diagnostic Results:</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.activeLogoAccessible)}
                  <span className="text-sm">Active Logo URL</span>
                </div>
                {getStatusBadge(testResults.activeLogoAccessible)}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.fallbackLogoAccessible)}
                  <span className="text-sm">Fallback Logo URL</span>
                </div>
                {getStatusBadge(testResults.fallbackLogoAccessible)}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.storageAccessible)}
                  <span className="text-sm">Storage Access</span>
                </div>
                {getStatusBadge(testResults.storageAccessible)}
              </div>
            </div>

            {needsRecovery && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Logo recovery is recommended. Click "Recover Logo" to fix the issues.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Current Active:</strong> {logoConfig.activeLogoUrl}</div>
          <div><strong>Current Fallback:</strong> {logoConfig.fallbackLogoUrl}</div>
        </div>
      </CardContent>
    </Card>
  );
};
