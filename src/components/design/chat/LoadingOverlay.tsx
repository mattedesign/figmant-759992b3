
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, FileText } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  progress?: number;
  estimatedTime?: number | null;
  stage?: string;
  steps?: Array<{
    id: string;
    label: string;
    status: 'pending' | 'active' | 'complete' | 'error';
  }>;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  title = "Processing...",
  description,
  progress,
  estimatedTime,
  stage,
  steps = []
}) => {
  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="p-6 max-w-md w-full mx-4 space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {progress !== undefined && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress}% complete</span>
              {estimatedTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(estimatedTime)} remaining
                </span>
              )}
            </div>
          </div>
        )}

        {stage && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {stage}
            </Badge>
          </div>
        )}

        {steps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Progress</h4>
            <div className="space-y-1">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2 text-sm">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${step.status === 'complete' ? 'bg-green-500' : ''}
                    ${step.status === 'active' ? 'bg-primary animate-pulse' : ''}
                    ${step.status === 'pending' ? 'bg-muted-foreground/30' : ''}
                    ${step.status === 'error' ? 'bg-red-500' : ''}
                  `} />
                  <span className={step.status === 'active' ? 'font-medium' : ''}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
