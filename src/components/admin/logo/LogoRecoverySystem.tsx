import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { LogoRecoveryDiagnostics } from './components/LogoRecoveryDiagnostics';
import { LogoRecoveryActions } from './components/LogoRecoveryActions';
import { LogoRecoveryResults } from './components/LogoRecoveryResults';
import type { LogoTestResults, RecoveryStatus } from './types/LogoRecoveryTypes';

export const LogoRecoverySystem: React.FC = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus>('idle');
  const [testResults, setTestResults] = useState<LogoTestResults>({
    activeLogoAccessible: null,
    fallbackLogoAccessible: null,
    storageAccessible: null
  });

  const { logoConfig } = useLogoConfig();

  const needsRecovery = testResults.activeLogoAccessible === false;

  const runDiagnostics = async () => {
    // This function will be passed to LogoRecoveryActions for re-running diagnostics after recovery
    // The actual implementation is in LogoRecoveryDiagnostics component
  };

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
          <LogoRecoveryDiagnostics
            recoveryStatus={recoveryStatus}
            setRecoveryStatus={setRecoveryStatus}
            setTestResults={setTestResults}
            activeLogoUrl={logoConfig.activeLogoUrl}
            fallbackLogoUrl={logoConfig.fallbackLogoUrl}
          />
          
          <LogoRecoveryActions
            isRecovering={isRecovering}
            setIsRecovering={setIsRecovering}
            recoveryStatus={recoveryStatus}
            setRecoveryStatus={setRecoveryStatus}
            testResults={testResults}
            needsRecovery={needsRecovery}
            runDiagnostics={runDiagnostics}
          />
        </div>

        <LogoRecoveryResults
          recoveryStatus={recoveryStatus}
          testResults={testResults}
          needsRecovery={needsRecovery}
          activeLogoUrl={logoConfig.activeLogoUrl}
          fallbackLogoUrl={logoConfig.fallbackLogoUrl}
        />
      </CardContent>
    </Card>
  );
};
