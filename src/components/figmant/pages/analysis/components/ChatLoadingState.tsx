
import React from 'react';
import { Loader2, MessageSquare } from 'lucide-react';

interface ChatLoadingStateProps {
  message?: string;
  showIcon?: boolean;
}

export const ChatLoadingState: React.FC<ChatLoadingStateProps> = ({ 
  message = "Loading chat analysis...",
  showIcon = true 
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        {showIcon && (
          <div className="relative">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
            <Loader2 className="h-6 w-6 text-primary animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};
