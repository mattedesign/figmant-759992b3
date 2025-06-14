
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, ExternalLink } from 'lucide-react';
import { ClaudeAIStatusIndicator } from './ClaudeAIStatusIndicator';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useAuth } from '@/contexts/AuthContext';
import { getConnectionStatus } from '@/utils/claudeStatus';

interface ClaudeAISetupPromptProps {
  storageStatus?: 'checking' | 'ready' | 'error';
  showStorageRelatedAlert?: boolean;
}

export const ClaudeAISetupPrompt: React.FC<ClaudeAISetupPromptProps> = ({ 
  storageStatus = 'ready',
  showStorageRelatedAlert = false 
}) => {
  const { data: claudeSettings, isLoading } = useClaudeSettings();
  const { isOwner } = useAuth();

  if (isLoading) {
    return null;
  }

  const connectionStatus = getConnectionStatus(
    claudeSettings?.claude_ai_enabled || false, 
    claudeSettings?.claude_api_key || ''
  );

  const isClaudeReady = connectionStatus.status === 'ready';
  const isStorageError = storageStatus === 'error';

  // Only show storage-related Claude alert if:
  // 1. Storage is actually in error state
  // 2. Claude is ready (so the issue isn't Claude itself)
  // 3. User is owner (who can fix it)
  // 4. We're explicitly asked to show storage-related alert
  const showStorageClaudeAlert = showStorageRelatedAlert && 
                                 isStorageError && 
                                 isClaudeReady && 
                                 isOwner;

  // Show Claude configuration alert if Claude is not ready
  const showClaudeConfigAlert = !isClaudeReady && isOwner;

  if (!showClaudeConfigAlert && !showStorageClaudeAlert) {
    return null;
  }

  const handleConfigureClick = () => {
    // Navigate to Claude settings
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('tab', 'claude');
    window.location.href = currentUrl.toString();
  };

  if (showStorageClaudeAlert) {
    return (
      <div className="mb-4">
        <Alert variant="default" className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="font-medium">File Upload Issues Detected</span>
                <br />
                <span className="text-sm">
                  If uploads are failing, this may be related to storage configuration. 
                  Check your storage settings or Claude API configuration.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfigureClick}
                className="ml-2 flex items-center gap-1 border-amber-200 text-amber-700 hover:bg-amber-100"
              >
                <Settings className="h-3 w-3" />
                Settings
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Alert variant="default" className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div>
                <span className="font-medium">Claude AI Configuration Required</span>
                <br />
                <span className="text-sm">
                  Configure your Claude API key to enable AI design analysis and chat features.
                </span>
              </div>
              <ClaudeAIStatusIndicator compact />
            </div>
            <div className="ml-2 space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfigureClick}
                className="flex items-center gap-1 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Settings className="h-3 w-3" />
                Configure
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs text-blue-600 hover:bg-blue-100"
              >
                <a
                  href="https://console.anthropic.com/account/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Get API Key
                </a>
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
