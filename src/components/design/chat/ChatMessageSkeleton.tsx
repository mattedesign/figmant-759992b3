
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

export const ChatMessageSkeleton: React.FC = () => {
  return (
    <div className="flex justify-start space-x-2 animate-fade-in">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback>
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="max-w-[80%] space-y-3">
        <Card className="bg-background">
          <CardContent className="p-3 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
