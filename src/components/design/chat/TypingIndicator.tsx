
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bot, Loader2 } from 'lucide-react';

interface TypingIndicatorProps {
  stage: string;
  progress: number;
  estimatedTimeRemaining: number | null;
  stageMessage: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  stage,
  progress,
  estimatedTimeRemaining,
  stageMessage
}) => {
  return (
    <div className="flex justify-start space-x-2 animate-fade-in">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback>
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="max-w-[80%]">
        <Card className="bg-background border-primary/20">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-primary">
                {stageMessage}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              {estimatedTimeRemaining && (
                <div className="text-xs text-muted-foreground">
                  Estimated time remaining: {estimatedTimeRemaining}s
                </div>
              )}
            </div>
            
            {/* Animated dots */}
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
