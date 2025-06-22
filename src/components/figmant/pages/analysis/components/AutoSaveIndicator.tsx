
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Save, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AutoSaveIndicatorProps {
  status: 'saving' | 'saved' | 'error' | 'idle';
  lastSaved?: Date;
  messageCount?: number;
  className?: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
  lastSaved,
  messageCount = 0,
  className = ""
}) => {
  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Save className="h-3 w-3 animate-pulse" />,
          text: 'Saving...',
          variant: 'secondary' as const,
          className: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'saved':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Saved',
          variant: 'default' as const,
          className: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Save Error',
          variant: 'destructive' as const,
          className: 'bg-red-50 text-red-700 border-red-200'
        };
      default:
        return null;
    }
  };

  const statusContent = getStatusContent();
  
  if (!statusContent) return null;

  const nextAutoSave = messageCount > 0 ? 5 - (messageCount % 5) : 5;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={statusContent.variant}
        className={`flex items-center gap-1 text-xs ${statusContent.className}`}
      >
        {statusContent.icon}
        {statusContent.text}
      </Badge>
      
      {status === 'saved' && messageCount > 0 && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Next save in {nextAutoSave} messages
        </Badge>
      )}
      
      {lastSaved && status === 'saved' && (
        <span className="text-xs text-gray-500">
          {lastSaved.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
