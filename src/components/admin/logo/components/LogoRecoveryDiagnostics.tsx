
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { testImageUrl } from '@/utils/logoTestUtils';
import { supabase } from '@/integrations/supabase/client';
import type { LogoTestResults, RecoveryStatus } from '../types/LogoRecoveryTypes';

interface LogoRecoveryDiagnosticsProps {
  recoveryStatus: RecoveryStatus;
  setRecoveryStatus: (status: RecoveryStatus) => void;
  setTestResults: (results: LogoTestResults) => void;
  activeLogoUrl: string;
  fallbackLogoUrl: string;
}

export const LogoRecoveryDiagnostics: React.FC<LogoRecoveryDiagnosticsProps> = ({
  recoveryStatus,
  setRecoveryStatus,
  setTestResults,
  activeLogoUrl,
  fallbackLogoUrl
}) => {
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setRecoveryStatus('testing');
    console.log('=== LOGO RECOVERY DIAGNOSTICS START ===');

    try {
      // Test active logo URL
      console.log('Testing active logo URL:', activeLogoUrl);
      const activeLogoTest = await testImageUrl(activeLogoUrl);
      
      // Test fallback logo URL
      console.log('Testing fallback logo URL:', fallbackLogoUrl);
      const fallbackLogoTest = await testImageUrl(fallbackLogoUrl);

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

  return (
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
  );
};
