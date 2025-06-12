
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import type { LogoTestResults, RecoveryStatus } from '../types/LogoRecoveryTypes';

interface LogoRecoveryActionsProps {
  isRecovering: boolean;
  setIsRecovering: (recovering: boolean) => void;
  recoveryStatus: RecoveryStatus;
  setRecoveryStatus: (status: RecoveryStatus) => void;
  testResults: LogoTestResults;
  needsRecovery: boolean;
  runDiagnostics: () => Promise<void>;
}

export const LogoRecoveryActions: React.FC<LogoRecoveryActionsProps> = ({
  isRecovering,
  setIsRecovering,
  recoveryStatus,
  setRecoveryStatus,
  testResults,
  needsRecovery,
  runDiagnostics
}) => {
  const { toast } = useToast();
  const { updateActiveLogo, resetToDefault, reload } = useLogoConfig();

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

  if (!needsRecovery || recoveryStatus !== 'complete') {
    return null;
  }

  return (
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
  );
};
