
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SystemStatusSectionProps {
  lastAnalysisResult?: any;
}

export const SystemStatusSection: React.FC<SystemStatusSectionProps> = ({ 
  lastAnalysisResult 
}) => {
  return (
    <div className="space-y-4">
      {/* Claude Settings Source */}
      <div>
        <h4 className="font-medium text-sm mb-2">Claude Configuration</h4>
        <div className="grid grid-cols-2 gap-2">
          <Badge variant={lastAnalysisResult?.debugInfo?.settingsSource === 'admin_settings' ? 'default' : 'destructive'}>
            Settings Source: {lastAnalysisResult?.debugInfo?.settingsSource || 'Unknown'}
          </Badge>
          <Badge variant="outline">API Key: From Admin Settings</Badge>
        </div>
      </div>

      {/* System Status */}
      <div>
        <h4 className="font-medium text-sm mb-2">System Status</h4>
        <div className="grid grid-cols-2 gap-2">
          <Badge variant="outline">Storage: Ready</Badge>
          <Badge variant="outline">Claude AI: Admin Settings</Badge>
          <Badge variant="outline">Auth: Connected</Badge>
          <Badge variant="outline">Edge Function: Active</Badge>
        </div>
      </div>
    </div>
  );
};
