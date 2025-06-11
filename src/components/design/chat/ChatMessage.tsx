
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Bot, Info, Image, Globe } from 'lucide-react';
import { ChatMessageType } from '../DesignChatInterface';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} space-x-2`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback>
            {isSystem ? <Info className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <Card className={`${isUser ? 'bg-primary text-primary-foreground' : isSystem ? 'bg-muted' : 'bg-background'}`}>
          <CardContent className="p-3">
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center space-x-2 p-2 rounded bg-muted/50">
                    {attachment.type === 'file' ? (
                      <>
                        <Image className="h-4 w-4" />
                        <span className="text-sm truncate">{attachment.name}</span>
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4" />
                        <span className="text-sm truncate">{attachment.url}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Message content */}
            <div className="whitespace-pre-wrap text-sm">
              {message.content}
            </div>
            
            {/* Analysis results preview */}
            {message.analysisResult && (
              <div className="mt-3 p-2 rounded bg-muted/50">
                <Badge variant="secondary" className="mb-2">
                  Analysis Complete
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Click to view detailed results
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-xs text-muted-foreground mt-1 px-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
