
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Settings, Activity } from 'lucide-react';

interface ChatHeaderProps {
  onToggleProcessingMonitor: () => void;
  onToggleDebugPanel: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleProcessingMonitor,
  onToggleDebugPanel
}) => {
  return (
    <CardHeader className="flex-shrink-0">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5" />
          Design Analysis Chat
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleProcessingMonitor}
            className="flex items-center gap-1"
          >
            <Activity className="h-3 w-3" />
            Monitor
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleDebugPanel}
            className="flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Debug
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
