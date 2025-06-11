
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, Bug } from 'lucide-react';
import { ChatAttachment } from '../DesignChatInterface';

interface DebugPanelProps {
  attachments: ChatAttachment[];
  lastAnalysisResult?: any;
  isVisible?: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ 
  attachments, 
  lastAnalysisResult,
  isVisible = false 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isVisible) return null;

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50">
      <CardHeader 
        className="cursor-pointer hover:bg-orange-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bug className="h-4 w-4" />
          Debug Information
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-4">
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

          {/* Attachments Debug */}
          <div>
            <h4 className="font-medium text-sm mb-2">Attachments Status</h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{attachment.name}</span>
                    <Badge variant={attachment.status === 'uploaded' ? 'default' : 'destructive'}>
                      {attachment.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Type: {attachment.type} | 
                    {attachment.uploadPath ? ' Has Upload Path' : ' No Upload Path'} |
                    {attachment.url ? ' Has URL' : ' No URL'}
                  </div>
                </div>
              ))}
              {attachments.length === 0 && (
                <div className="text-sm text-gray-500 italic">No attachments</div>
              )}
            </div>
          </div>

          {/* Last Analysis Result */}
          {lastAnalysisResult && (
            <div>
              <h4 className="font-medium text-sm mb-2">Last Analysis Result</h4>
              <div className="p-3 bg-white rounded border">
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify(lastAnalysisResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Environment Status */}
          <div>
            <h4 className="font-medium text-sm mb-2">System Status</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline">Storage: Ready</Badge>
              <Badge variant="outline">Claude AI: Admin Settings</Badge>
              <Badge variant="outline">Auth: Connected</Badge>
              <Badge variant="outline">Edge Function: Active</Badge>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
