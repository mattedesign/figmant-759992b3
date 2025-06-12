
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { LogoTestResults, RecoveryStatus } from '../types/LogoRecoveryTypes';

interface LogoRecoveryResultsProps {
  recoveryStatus: RecoveryStatus;
  testResults: LogoTestResults;
  needsRecovery: boolean;
  activeLogoUrl: string;
  fallbackLogoUrl: string;
}

export const LogoRecoveryResults: React.FC<LogoRecoveryResultsProps> = ({
  recoveryStatus,
  testResults,
  needsRecovery,
  activeLogoUrl,
  fallbackLogoUrl
}) => {
  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />;
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Testing...</Badge>;
    return status ? <Badge variant="default" className="bg-green-500">OK</Badge> : <Badge variant="destructive">Failed</Badge>;
  };

  if (recoveryStatus === 'idle') {
    return null;
  }

  return (
    <div className="space-y-4">
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

      <div className="text-xs text-muted-foreground space-y-1">
        <div><strong>Current Active:</strong> {activeLogoUrl}</div>
        <div><strong>Current Fallback:</strong> {fallbackLogoUrl}</div>
      </div>
    </div>
  );
};
