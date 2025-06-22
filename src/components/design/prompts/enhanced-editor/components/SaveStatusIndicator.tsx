
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveStatusIndicatorProps {
  status: 'saved' | 'saving' | 'error' | 'idle';
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saved':
        return {
          icon: CheckCircle,
          text: 'Saved',
          className: 'text-green-600'
        };
      case 'saving':
        return {
          icon: Clock,
          text: 'Saving...',
          className: 'text-blue-600 animate-pulse'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Save failed',
          className: 'text-red-600'
        };
      case 'idle':
      default:
        return {
          icon: Save,
          text: 'Not saved',
          className: 'text-muted-foreground'
        };
    }
  };

  const { icon: Icon, text, className } = getStatusConfig();

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Icon className="h-4 w-4" />
      <span>{text}</span>
    </div>
  );
};
