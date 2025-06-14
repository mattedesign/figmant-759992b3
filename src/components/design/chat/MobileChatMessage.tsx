
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bot, Image, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatMessage as ChatMessageType } from '../DesignChatInterface';

interface MobileChatMessageProps {
  message: ChatMessageType;
}

export const MobileChatMessage: React.FC<MobileChatMessageProps> = ({ message }) => {
  const isMobile = useIsMobile();
  const isUser = message.role === 'user';
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if message is long and needs truncation on mobile
  const isLongMessage = message.content.length > 300;
  const shouldTruncate = isMobile && isLongMessage && !isExpanded;
  const displayContent = shouldTruncate 
    ? message.content.substring(0, 300) + '...'
    : message.content;

  if (isMobile) {
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} space-x-2 px-4`}>
        {!isUser && (
          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`max-w-[85%] ${isUser ? 'order-first' : ''}`}>
          <Card className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
            <CardContent className="p-3">
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2 space-y-2">
                  {message.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-2 p-2 rounded bg-muted/50">
                      {attachment.type === 'file' ? (
                        <>
                          <Image className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{attachment.name}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{attachment.url}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Message content */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {displayContent}
              </div>
              
              {/* Expand/Collapse button for long messages */}
              {isLongMessage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 h-auto p-1 text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show more
                    </>
                  )}
                </Button>
              )}
              
              {/* Analysis results preview */}
              {message.batchId && (
                <div className="mt-3 p-2 rounded bg-muted/50">
                  <Badge variant="secondary" className="mb-2">
                    Analysis Complete
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Tap to view detailed results
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
          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }

  // Desktop layout - return original component structure
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} space-x-2`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <Card className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
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
            {message.batchId && (
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
